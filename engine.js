"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var engineFunction_1 = require("./src/engineFunction");
console.log("Starting Decision Engine...");
var events = [
    { type: "AgentJoined", agentId: "A", capacity: 7 },
    { type: "AgentJoined", agentId: "B", capacity: 5 },
    { type: "ResourceAdded", amount: 6 },
    { type: "AgentRequested", agentId: "A", amount: 6 },
    { type: "AgentRequested", agentId: "B", amount: 4 },
    { type: "TimeAdvanced", tick: 1 },
];
console.log("Processing Events:");
for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
    var e = events_1[_i];
    console.log(e);
}
console.log("before decision...");
var decisions = (0, engineFunction_1.default)(events);
for (var _a = 0, decisions_1 = decisions; _a < decisions_1.length; _a++) {
    var d = decisions_1[_a];
    console.log("Decision:");
    console.log("=====");
    console.log("Valid:", d.valid);
    console.log("----");
    console.log("Agent Allocation Scores and Reasons:");
    console.log("Allocation:", d.allocation);
    console.log("Score:", d.score);
    console.log("Reasons:", d.reason);
    console.log("----");
}
console.log("Decision Engine Finished.");
