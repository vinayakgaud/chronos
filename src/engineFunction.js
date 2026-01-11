"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decisionScoring_1 = require("./decisionScoring");
var stateReducer_1 = require("./stateReducer");
var decide = function (events) {
    //Initial State
    var initial = { time: 0, available: 0, agents: {} };
    var state = events.reduce(stateReducer_1.default, initial);
    console.log("FINAL STATE:", JSON.stringify(state, null, 2));
    var candidates = [
        {
            A: 3,
            B: 3
        },
        {
            A: 4,
            B: 2
        },
        {
            A: 6,
            B: 0
        }
    ];
    return candidates.map(function (c) { return (0, decisionScoring_1.scoreAllocation)(state, c); }).filter(function (r) { return r.valid; }).sort(function (a, b) { return b.score - a.score; });
};
exports.default = decide;
