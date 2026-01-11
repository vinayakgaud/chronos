"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateReducer = void 0;
var stateReducer = function (state, event) {
    var _a, _b;
    var _c, _d;
    switch (event.type) {
        case "AgentJoined": return __assign(__assign({}, state), { agents: __assign(__assign({}, state.agents), (_a = {}, _a[event.agentId] = {
                capacity: event.capacity,
                allocated: 0,
                requested: 0,
                starvationTicks: 0
            }, _a)) });
        case "ResourceAdded": return __assign(__assign({}, state), { available: state.available + event.amount });
        case "AgentRequested": {
            var agent = state.agents[event.agentId];
            if (!agent) {
                return state; //ignore requests from unknown agents
            }
            return __assign(__assign({}, state), { agents: __assign(__assign({}, state.agents), (_b = {}, _b[event.agentId] = __assign(__assign({}, agent), { requested: event.amount }), _b)) });
        }
        case "TimeAdvanced": {
            var newAgents = {};
            for (var _i = 0, _e = Object.entries(state.agents); _i < _e.length; _i++) {
                var _f = _e[_i], agentId = _f[0], agent = _f[1];
                newAgents[agentId] = {
                    capacity: (_c = agent.capacity) !== null && _c !== void 0 ? _c : 0,
                    allocated: 0, //reset for next tick
                    requested: (_d = agent.requested) !== null && _d !== void 0 ? _d : 0, //reset requests each tick
                    starvationTicks: agent.allocated === 0 ? agent.starvationTicks + 1 : 0
                };
            }
            return __assign(__assign({}, state), { time: event.tick, agents: newAgents });
        }
    }
};
exports.stateReducer = stateReducer;
exports.default = exports.stateReducer;
