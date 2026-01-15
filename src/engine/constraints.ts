import { type State } from "./types/primitiveEvents";
import { type Allocation } from "./decisionScoring";

type ConstraintViolation = {
  kind: ConstraintViolationKind,
  agentId?: string,
  amount?: number
}

type ConstraintResult = 
| {ok: true} 
| {ok: false; violations: ConstraintViolation[]}

enum ConstraintViolationKind{
  UnknownAgent = "UnknownAgent",
  TotalAllocationExceedsAvailable = "TotalAllocationExceedsAvailable",
  AgentCapacityExceeded = "AgentCapacityExceeded"
}

export const checkConstraints = (state: State, allocation: Allocation): ConstraintResult => {
  const violations: ConstraintViolation[] = [];
  
  // No allocation to unknown agents
  for(const agentId of Object.keys(allocation)){
    if(!state.agents[agentId]){
      violations.push({kind: ConstraintViolationKind.UnknownAgent, agentId});
    }
  }

  //Total allocation should not exceed available resources
  const totalAllocated = Object.values(allocation).reduce((sum, amount)=> sum + amount, 0);
  if(totalAllocated > state.available){
    violations.push({kind: ConstraintViolationKind.TotalAllocationExceedsAvailable, amount: totalAllocated - state.available});
  }

  // Per agent allocation should not exceed their capacity
  for(const [agentId, amount] of Object.entries(allocation)){
    const agent = state.agents[agentId];
    if(!agent) continue
    if(amount > agent.capacity){
      violations.push({kind: ConstraintViolationKind.AgentCapacityExceeded, agentId, amount: amount - agent.capacity});
    }
  }

  return violations.length === 0 ? {ok:true} : {ok:false, violations}
}
