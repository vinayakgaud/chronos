import { type Allocation, scoreAllocation } from "./decisionScoring";
import stateReducer from "./stateReducer";
import type { PrimitiveEvent, State } from "./types/primitiveEvents";
import { checkConstraints } from "./constraints";
import type { ScoredDecision } from "./types/reasons";
import { uuid } from "uuidv4";

type GeneratedCandidateInfo = | {
  kind: "NumberOfAgentsZero",
  message: string
} | {
  kind: "NoAmountRequested",
  message: string
} | {
  kind: "Success",
  candidates: Allocation[]
}

function generateCandidate(numberOfAgents: number, requested: number): GeneratedCandidateInfo{
  //placeholder - in real scenario this would generate based on some logic
  const randomRequested = Math.random() * requested;
  if(numberOfAgents === 0){
    return {kind: "NumberOfAgentsZero", message: "No agents or no capacity requested"};
  }
  if(randomRequested === 0){
    return {kind: "NoAmountRequested", message: "No amount requested"};
  }

  const candidates: Allocation[] = [];

  for(let i = 1; i<= numberOfAgents; i++){
    candidates.push({[uuid().slice(0,5)]: Math.floor(randomRequested * Math.floor((1 + Math.random()) * 2))});
  }

  return {kind: "Success", candidates};
}

export function candidateId() {
  const candidate = generateCandidate(3,3);
  return candidate.kind === "Success" ? candidate.candidates : [];
}

export function decideFromState(state: State): ScoredDecision[]{
  // const candidateInfo = generateCandidate(3,3);
  // const candidates: Allocation[] = candidateInfo.kind === "Success" ? candidateInfo.candidates : [];

  const candidates: Allocation[] = [
    { "A": 3, "B": 3 },
    { "A": 6, "B": 4 },
    { "A": 6, "B": 0 },
  ]

  console.log("generated candidates", candidates);
  const evaluatedCandidates = candidates.map(allocation => {
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

