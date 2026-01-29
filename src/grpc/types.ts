import { type PrimitiveEvent } from "../engine/types/primitiveEvents";
import { type ScoredDecision } from "../engine/types/reasons";

export const EventType = {
  AGENT_JOINED: 1,
  AGENT_REQUESTED: 2,
  RESOURCE_ADDED: 3,
  TIME_ADVANCED: 4,
}

export function mapProtoEvent(event: any): PrimitiveEvent{
  if(!event) throw new Error("Missing event");

  const agentId = event.agent_id ?? event.agentId;
  if ((event.type === "AGENT_JOINED" || event.type === "AGENT_REQUESTED") && !agentId) {
    throw new Error("Missing agent_id in event");
  }

  if (event.type === 0 || event.type === "EVENT_TYPE_UNSPECIFIED") {
    throw new Error("Unspecified event type");
  }

  switch(event.type){
    case "AGENT_JOINED":
      return {type: "AgentJoined", agentId, capacity: event.capacity};
    case "AGENT_REQUESTED":
      return {type: "AgentRequested", agentId, amount: event.amount};
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
    allocations: Object.entries(decision.allocation).map(([agentId, amount])=>({agent_id: agentId, amount})),
    score: decision.score,
    reasons: decision.reason.map(r => ({
      kind: r.kind,
      agent_id: "agentId" in r ? r.agentId : "",
      ratio: "ratio" in r ? r.ratio : 0,
      ticks: "ticks" in r ? r.ticks : 0,
      variance: "variance" in r ? r.variance : 0,
    }))
  }
}
