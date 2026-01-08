const stateReducer = (state: State, event: PrimitiveEvent): State =>{
  switch(event.type){
    case "AgentJoined": return{
        ...state,
        [event.agentId]:{
          capacity: event.capacity,
          allocated: 0,
          requested: 0,
          starvationTicks: 0
        }
    }
    
    case "ResourceAdded": return{
        ...state,
        available: state.available + event.amount
    }

    case "AgentRequested": return {
      ...state,
      agents: {
        ...state.agents,
        [event.agentId]: {
          ...state.agents[event.agentId],
          requested: event.amount
        }
      }
    }
    case "TimeAdvanced": return {
      ...state,
      time: event.tick,
      agents: Object.fromEntries(
        Object.entries(state.agents).map(([agentId, agent])=>[
          agentId,
          {
            ...agent,
            starvationTicks: agent.allocated === 0 ? agent.starvationTicks + 1 : 0,
            allocated: 0, //reset for next tick
          }
        ])
      )
    }
  }
}
