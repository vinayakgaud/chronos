import type { Allocation } from '../decisionScoring';

type Reason = | {
  kind: "Fulfillment", agentId: string, ratio: number
} | {
  kind: "Starvation", agentId: string, ticks?: number
} | {
  kind: "StarvationHistory", agentId: string, ticks: number
} | {
  kind: "AgentMissing", agentId: string
} | {
  kind: "ImbalancePenalty", variance: number
}


type ScoredDecision = {
  allocation: Allocation,
  score: number,
  reason : Reason[]
}

export type { Reason, ScoredDecision };
