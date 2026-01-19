import { type Allocation, scoreAllocation } from "./decisionScoring";
import stateReducer from "./stateReducer";
import type { PrimitiveEvent, State } from "./types/primitiveEvents";
import { checkConstraints } from "./constraints";
import type { ScoredDecision } from "./types/reasons";

function generateCandidate(state: State, seed: number): Allocation[]{
  const agents = state.agents;
  const available = state.available;
  const candidates: Allocation[] = [];
  const randomGenerator = (seed: number)=>{
    const x = Math.sin(seed++)*1000;
    return x - Math.floor(x);
  }

  for(let i=0; i<10; i++){
    let remaining = available;
    const allocation: Allocation = {};
      for(const [agentId, agent] of Object.entries(agents)){
        if(remaining <= 0) break;
        const maxForAgent = Math.min(remaining, agent.capacity, agent.requested);
        const allocationPerAgent = Math.floor(randomGenerator(seed++) * (maxForAgent + 1));
        allocation[agentId] = allocationPerAgent;
        remaining -= allocationPerAgent;
      }
    candidates.push(allocation);
  }
  return candidates;
}

const uniqueCandidatesSet = (candidates: Allocation[]): Allocation[]=>{
  const uniqueSet = new Set<string>();
  const uniqueCandidates: Allocation[] = [];
  for(const candidate of candidates){
    const key = JSON.stringify(candidate);
    if(!uniqueSet.has(key)){
      uniqueSet.add(key);
      uniqueCandidates.push(candidate);
    }
  }
  return uniqueCandidates;
}

export function decideFromState(state: State): ScoredDecision[]{
  const candidates = generateCandidate(state, 2000);
  const uniqueCandidates = uniqueCandidatesSet(candidates);
  console.log("generated candidates", candidates);
  const evaluatedCandidates = uniqueCandidates.map(allocation => {
    const constraint = checkConstraints(state, allocation);
    return {allocation, constraint};
  })
  evaluatedCandidates.forEach(c=> console.log("allocation:", c.allocation, "constraint:", c.constraint))
  const constrainedCandidates = evaluatedCandidates.filter(r=> r.constraint.ok).map(r=> r.allocation);

  return constrainedCandidates.map(c => scoreAllocation(state, c)).sort((a,b)=> b.score - a.score || JSON.stringify(a.allocation).localeCompare(JSON.stringify(b.allocation)))
}

export const decide = (events: PrimitiveEvent[]):ScoredDecision[] => {
  const initial:State = {time: 0, available: 0, agents: {}};
  const state = events.reduce(stateReducer, initial);
  return decideFromState(state);
}

