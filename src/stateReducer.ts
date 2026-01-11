import type { State, PrimitiveEvent, AgentState } from "./types/primitiveEvents"

export const stateReducer = (state: State, event: PrimitiveEvent): State =>{
  switch(event.type){
    case "AgentJoined": return{
        ...state,
        agents: {
          ...state.agents,
          [event.agentId]:{
          capacity: event.capacity,
          allocated: 0,
          requested: 0,
          starvationTicks: 0
        }
        }
    }
    
    case "ResourceAdded": return{
        ...state,
        available: state.available + event.amount
    }

    case "AgentRequested": {
      const agent = state.agents[event.agentId];
      if(!agent){
        return state; //ignore requests from unknown agents
      }
      return {
      ...state,
      agents: {
        ...state.agents,
        [event.agentId]: {
          ...agent,
          requested: event.amount,
        }
      }
    }}
    case "TimeAdvanced": {
      const newAgents: Record <string, AgentState> = {};

      for( const [agentId, agent] of Object.entries(state.agents)){
        newAgents[agentId] = {
          capacity: agent.capacity ?? 0,
          allocated: 0, //reset for next tick
          requested:agent.requested?? 0, //reset requests each tick
          starvationTicks: agent.allocated === 0 ? agent.starvationTicks + 1 : 0
        }
      }
      return {
      ...state,
      time: event.tick,
      agents: newAgents
    }
  }}
}

export default stateReducer;
