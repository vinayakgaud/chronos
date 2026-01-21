import type { PrimitiveEvent } from "./src/engine/types/primitiveEvents";
import {decideFromEvents} from "./src/engine/engineFunction";
import {v4 as uuid_v4} from "uuid";
import readline from "readline";

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const events: PrimitiveEvent[] = [];

const question =async (query: string) => {
  return new Promise<string>((resolve)=>{
    rl.question(query,resolve)
  }).finally(()=> rl.close())
}

const numOfAgents: number = parseInt(await question("Enter number of agents to simulate: "));

function eventCreation(numOfAgents: number): PrimitiveEvent[]{
  for(let i=0;i<numOfAgents;i++){
    const agentId = uuid_v4().slice(0,4);
    events.push({ type: "AgentJoined", agentId, capacity: 5 + Math.floor(Math.random()*6)});
    events.push({ type: "AgentRequested", agentId, amount: 3 + Math.floor(Math.random()*5)});
  }
  events.push({ type: "ResourceAdded", amount: 15 });
  events.push({ type: "TimeAdvanced", tick: 1 });
  return events;
}

console.log("Starting Decision Engine...");
console.log("Processing Events:");
const decisions = decideFromEvents(eventCreation(numOfAgents), {seed: 1000, topK: undefined});

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

