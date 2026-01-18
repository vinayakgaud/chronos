import type { PrimitiveEvent } from "./src/engine/types/primitiveEvents";
import {decide} from "./src/engine/engineFunction";
import {candidateId} from "./src/engine/engineFunction";

console.log("Starting Decision Engine...");

const events: PrimitiveEvent[] = [
  { type: "AgentJoined", agentId: "A", capacity: 7 },
  { type: "AgentJoined", agentId: "B", capacity: 5 },
  { type: "ResourceAdded", amount: 6 },
  { type: "AgentRequested", agentId: "A", amount: 6 },
  { type: "AgentRequested", agentId: "B", amount: 4 },
  { type: "TimeAdvanced", tick: 1 },
]

// const events: PrimitiveEvent[] = [];

// for(const [agentId, requested] of Object.entries(candidateId)){
//   events.push({type: "AgentJoined", agentId, capacity: requested + (Math.floor(Math.random()*4))});
//   events.push({type: "AgentRequested", agentId, amount: requested});
// }
// events.push({type: "ResourceAdded", amount: 15});
// events.push({type: "TimeAdvanced", tick: 1});


console.log("Processing Events:");

const decisions = decide(events);

for(const d of decisions){
  console.log("Decision:");
  console.log("----");
  console.log("Agent Allocation Scores and Reasons:");
  console.log("Allocation:", d.allocation);
  console.log("Score:", d.score);
  console.log("Reasons:", d.reason);
  console.log("----");
}

console.log("Decision Engine Finished.");
