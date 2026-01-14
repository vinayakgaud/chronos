import type { State } from "./types/primitiveEvents";
import type { Reason, ScoredDecision } from "./types/reasons";

export type Allocation = Record<string, number>;

export const scoreAllocation = (state: State, allocation: Allocation): ScoredDecision=>{
  let score = 0;
  let valid = true;
  const reasons: Reason[] = [];
  
  let totalAllocated = 0;

  for(const [agentId, amount] of Object.entries(allocation)){
    const agent = state.agents[agentId];
    totalAllocated += amount;

    if(agent === undefined){
      valid = false;
      reasons.push({kind: "AgentMissing", agentId});
      break;
    }

    if(amount >  agent.capacity){
      valid = false;
      reasons.push({kind: "CapacityExceeded", agentId});
      continue;
    }

    if(amount === 0 && agent.requested > 0){
      //starvation risk
      score -= 50;
      reasons.push({kind: "StarvationRisk", agentId});
    }

    const fulfillment = agent.requested > 0 ? Math.min(amount/agent.requested, 1): 0;
    score += fulfillment * 10;
    reasons.push({kind: "Fulfillment", agentId, value: fulfillment});

    if(agent.starvationTicks > 1){
      score += 5;
      reasons.push({kind: "StarvationHistory", agentId, ticks: agent.starvationTicks});
    }
  }

  if(totalAllocated > state.available){
    valid = false;
    reasons.push({kind: "ScarcityPenalty", excess: totalAllocated - state.available});
  }

  return {allocation, score, valid, reason: reasons};
}
