import type { PrimitiveEvent } from "./src/types/primitiveEvents";
import decide from "./src/engineFunction";

console.log("Starting Decision Engine...");

const events: PrimitiveEvent[] = [
  { type: "AgentJoined", agentId: "A", capacity: 7 },
  { type: "AgentJoined", agentId: "B", capacity: 5 },
  { type: "ResourceAdded", amount: 6 },
  { type: "AgentRequested", agentId: "A", amount: 6 },
  { type: "AgentRequested", agentId: "B", amount: 4 },
  { type: "TimeAdvanced", tick: 1 },
]

console.log("Processing Events:");
for( const e of events){
  console.log(e);
}
const decisions = decide(events);

for(const d of decisions){
  console.log("Decision:");
  console.log("----");
  console.log("Valid:", d.valid);
  console.log("----");
  console.log("Agent Allocation Scores and Reasons:");
  console.log("Allocation:", d.allocation);
  console.log("Score:", d.score);
  console.log("Reasons:", d.reason);
  console.log("----");
}

console.log("Decision Engine Finished.");
