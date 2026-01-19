//this is the language (GraphQL Schemea)
//"What questions are allowed?"
/**
 * Why this structure works

  Enums first (vocab)

  Inputs next (questions)

  Leaf types (small objects)

  Aggregate types (Decision)

  Root types last (Query)
 */
//Lists -> homogeneous (same type for all elements), and ordered
//GraphQL doesn't allow tuples
/**Int
Float
String
Boolean
ID - only allowed types in Graphql rest are custom scalars */

//allows - enums, input objects
//doesn't allow - Dictionaries / maps, Tuples, Arbitrary JSON objects, Dynamic keys, Unstructured blobs (without custom scalars)

export const typeDefinitionSchema = `
  enum PrimitiveEventType {
    AgentJoined
    ResourceAdded
    AgentRequested
    TimeAdvanced
  }

  input PrimitiveEventInput {
    type: PrimitiveEventType!
    agentId: String
    amount: Int
    capacity: Int
    tick: Int
  }
  
  type AllocationEntry {
    agentId: String!
    amount: Int!
  }

  type Reason {
    kind: String!
    agentId: String
    value: Float
    ticks: Int
  }

  type ScoredOption {
    allocation: [AllocationEntry!]!
    score: Float!
    valid: Boolean!
    reasons: [Reason!]!
  }

  type Decision {
    options: [ScoredOption!]!
  }

  type Query {
    decision(events: [PrimitiveEventInput!]!): Decision!
  }

  type DecisionResult {
    options: [DecisionOption!]!
  }

  type DecisionOption {
    allocation: [AllocationEntry!]!
    score: Float!
    reasons: [Reason!]!
  }
`
