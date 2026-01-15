import { type Allocation, scoreAllocation } from "./decisionScoring";
import stateReducer from "./stateReducer";
import type { PrimitiveEvent, State } from "./types/primitiveEvents";
import { checkConstraints } from "./constraints";

const decide = (events: PrimitiveEvent[]) => {
  //Initial State
  const initial: State = {time: 0, available: 0, agents: {}};
  const state = events.reduce(stateReducer, initial);

  const candidates: Allocation[] = [
    {
      A : 3,
      B : 3
    },
    {
      A : 4,
      B : 2
    },
    {
      A : 6,
      B : 0
    }
  ];

  const evaluatedCandidates = candidates.map(allocation => {
    const constraint = checkConstraints(state, allocation);
    return {allocation, constraint};
  })
  // evaluatedCandidates.forEach(c=> console.log("allocation:", c.allocation, "constraint:", c.constraint))
  const constrainedCandidates = evaluatedCandidates.filter(r=> r.constraint.ok).map(r=> r.allocation);

  return constrainedCandidates.map(c => scoreAllocation(state, c)).sort((a,b)=> b.score - a.score)
}

export default decide;
