import type { Allocation } from '../decisionScoring';

type Reason = | {
  kind: "Fulfillment", agentId: string, value: number
} | {
  kind: "StarvationRisk", agentId: string
} | {
  kind: "StarvationHistory", agentId: string, ticks: number
} | {
  kind: "CapacityExceeded", agentId: string,
} | {
  kind: "ScarcityPenalty", excess: number
} | {
  kind: "AgentMissing", agentId: string
}


type ScoredDecision = {
  allocation: Allocation,
  valid: boolean,
  score: number,
  reason : Reason[]
}

export type { Reason, ScoredDecision };
