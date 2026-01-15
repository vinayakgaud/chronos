import type { State } from "./types/primitiveEvents";
import type { Reason, ScoredDecision } from "./types/reasons";

export type Allocation = Record<string, number>;

export const scoreAllocation = (state: State, allocation: Allocation): ScoredDecision=>{
  let score = 0;
  const reasons: Reason[] = [];
  
  //per agent scoring
  for( const[agentId, amount] of Object.entries(allocation)){
    const agent = state.agents[agentId];
    if(!agent){
      reasons.push({kind: "AgentMissing", agentId});
      continue;
    }
    //Starvation Penalty
    if(agent.requested > 0 && amount == 0){
      const penalty = 10 * (agent.starvationTicks + 1)
      score -= penalty;
      reasons.push({kind: "Starvation", agentId, ticks: agent.starvationTicks});
      continue
    }
    console.log(agentId, "requested:", agent.requested, "allocated:", amount);
    //Fulfillment Reward
    if(amount > 0 && agent.requested > 0){
      const ratio = Math.min(amount/agent.requested, 1);
      const reward = ratio * 10;
      score += reward;
      reasons.push({kind: "Fulfillment", agentId, ratio});
    }

    //imbalance penalty
    const values = Object.values(allocation)
    const mean = values.reduce((value1,value2)=> value1+value2,0) / values.length;
    const variance = values.reduce((sum, value)=> sum + Math.pow(value - mean, 2), 0)/values.length
    if(variance > 0){
      score -= variance * 0.5;
      reasons.push({kind: "ImbalancePenalty", variance});
    }
  }
  return {allocation, score: Math.round(score * 100)/ 100, reason: reasons};
}
