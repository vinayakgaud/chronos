import { type Allocation, scoreAllocation } from "./decisionScoring";
import stateReducer from "./stateReducer";
import type { PrimitiveEvent, State } from "./types/primitiveEvents";
import { checkConstraints } from "./constraints";
import type { ScoredDecision } from "./types/reasons";

function generateCandidate(state: State, seed: number): Allocation[]{
  const agents = state.agents;
  const available = state.available;
  const candidates: Allocation[] = [];
  const randomGenerator = (()=>{
    return () =>{
      const x = Math.sin(seed++)* 1000;
      return x - Math.floor(x);
    }
  })();

  for(let i=0; i<10; i++){
    let remaining = available;
    const allocation: Allocation = {};
      for(const [agentId, agent] of Object.entries(agents)){
        if(remaining <= 0) break;
        const maxForAgent = Math.min(remaining, agent.capacity, agent.requested);
        const allocationPerAgent = Math.floor(randomGenerator() * (maxForAgent + 1));
        allocation[agentId] = allocationPerAgent;
        remaining -= allocationPerAgent;
      }
    candidates.push(allocation);
  }
  return candidates;
}

function removeRepeatedCandidate(candidates: Allocation[]): Allocation[]{
  const candidateSet = new Set<string>();
  const nonRepeatedCandidate: Allocation[] = [];
  for(const candidate of candidates){
    const key = JSON.stringify(candidate);
    if(!candidateSet.has(key)){
      candidateSet.add(key);
      nonRepeatedCandidate.push(candidate);
    }
  }
  return nonRepeatedCandidate;
}

function filteredFeasibleCandidate(state: State, candidates: Allocation[]): Allocation[]{
  return candidates.filter(allocation => checkConstraints(state, allocation).ok);
}

function scoreAndRankCandidates(state: State, candidates: Allocation[]): ScoredDecision[]{
  return candidates.map(candidate => scoreAllocation(state,candidate)).sort((a,b)=> b.score - a.score || JSON.stringify(a.allocation).localeCompare(JSON.stringify(b.allocation)));
}

export function decideFromState(state: State, seed: number): ScoredDecision[]{
  const explored = generateCandidate(state, seed);
  const uniqueCandidate = removeRepeatedCandidate(explored);
  const feasibleCandidates = filteredFeasibleCandidate(state, uniqueCandidate);
  return scoreAndRankCandidates(state, feasibleCandidates);
}

export function decideFromEvents(events: PrimitiveEvent[], seed: number):ScoredDecision[]{
  const initial:State = {time: 0, available: 0, agents: {}};
  const state = events.reduce(stateReducer, initial);
  return decideFromState(state, seed);
}

