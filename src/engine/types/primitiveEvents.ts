type PrimitiveEvent = | {
  type: "AgentJoined",
  agentId: string,
  capacity: number
} | {
  type: "ResourceAdded",
  amount: number
} | {
  type: "AgentRequested",
  agentId: string,
  amount: number
} | {
  type : "TimeAdvanced",
  tick: number
}

type AgentState = {
  capacity: number,
  allocated: number,
  requested: number,
  starvationTicks: number
}

type State = {
  time: number,
  available: number,
  agents: Record<string, AgentState>
}

export type { PrimitiveEvent, State, AgentState };
