type Allocation = Record<string, number>;

const scoreAllocation = (state: State, allocation: Allocation)=>{
  let score = 0;
  let valid = true;

  const reasons: string[] = [];

  for(const [agentId, amount] of Object.entries(allocation)){
    const agent = state.agents[agentId];

    if(amount >  agent.capacity){
      valid = false;
      reasons.push(`Agent ${agentId} allocated ${amount} exceeding capacity ${agent.capacity}`);
      continue;
    }

    if(amount === 0 && agent.requested > 0){
      //starvation penalty
      score -= 50
      reasons.push(`Agent ${agentId} starvation risk`);
    }

    const fulfillment = Math.min( amount/ agent.requested, 1);
    score += fulfillment * 100;

    if(agent.starvationTicks > 1){
      score += 5,
      reasons.push(`Agent ${agentId} has starvation history`);
    }
  }

  const totalAllocated = Object.values(allocation).reduce((a,b)=>a+b, 0);
  if(totalAllocated > state.available){
    valid = false;
    reasons.push(`Total allocation ${totalAllocated} exceeds available resources ${state.available}`);
  }

  return {allocation, score, valid, reasons}
}
