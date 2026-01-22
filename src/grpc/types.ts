import { type PrimitiveEvent } from "../engine/types/primitiveEvents";
import { type ScoredDecision } from "../engine/types/reasons";


export function mapProtoEvent(event: any): PrimitiveEvent{
  switch(event.type){
    case "AGENT_JOINED":
      return {type: "AgentJoined", agentId: event.agentId, capacity: event.capacity};
    case "AGENT_REQUESTED":
      return {type: "AgentRequested", agentId: event.agentId, amount: event.amount};
    case "RESOURCE_ADDED":
      return {type: "ResourceAdded", amount: event.amount};
    case "TIME_ADVANCED":
      return {type: "TimeAdvanced", tick: event.tick};
    default:
      throw new Error("Unknown event type");
  }
}

export function mapDecision(decision: ScoredDecision){
  return {
    allocation: Object.entries(decision.allocation).map(([agentId, amount])=>({agent_id: agentId, amount})),
    score: decision.score,
    reasons: decision.reason
  }
}
