"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreAllocation = void 0;
var scoreAllocation = function (state, allocation) {
    var score = 0;
    var valid = true;
    var reasons = [];
    var totalAllocated = 0;
    for (var _i = 0, _a = Object.entries(allocation); _i < _a.length; _i++) {
        var _b = _a[_i], agentId = _b[0], amount = _b[1];
        var agent = state.agents[agentId];
        totalAllocated += amount;
        if (agent === undefined) {
            console.log("\u274C AGENT MISSING: ".concat(agentId));
            valid = false;
            break;
        }
        if (amount > agent.capacity) {
            console.log("\u274C CAPACITY: ".concat(agentId, " ").concat(amount, " > ").concat(agent.capacity));
            valid = false;
            reasons.push({ kind: "CapacityExceeded", agentId: agentId });
            continue;
        }
        if (amount === 0 && agent.requested > 0) {
            //starvation risk
            console.log("\u274C STARVATION RISK: ".concat(agentId, " requested ").concat(agent.requested, " but got 0"));
            score -= 50;
            reasons.push({ kind: "StarvationRisk", agentId: agentId });
        }
        var fulfillment = agent.requested > 0 ? Math.min(amount / agent.requested, 1) : 0;
        score += fulfillment * 10;
        reasons.push({ kind: "Fulfillment", agentId: agentId, value: fulfillment });
        if (agent.starvationTicks > 1) {
            score += 5;
            reasons.push({ kind: "StarvationHistory", agentId: agentId, ticks: agent.starvationTicks });
        }
    }
    if (totalAllocated > state.available) {
        valid = false;
        reasons.push({ kind: "ScarcityPenalty", excess: totalAllocated - state.available });
    }
    return { allocation: allocation, score: score, valid: valid, reason: reasons };
};
exports.scoreAllocation = scoreAllocation;
