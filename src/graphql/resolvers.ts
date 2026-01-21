import {decideFromEvents} from "../engine/engineFunction";
import { type PrimitiveEvent } from "../engine/types/primitiveEvents";

export const resolvers = {
  Query: {
    decision: (_parent: unknown, args: {events: PrimitiveEvent[],seed: number, topK?: number})=>{
      if(!args || !args?.events || !args?.seed){
        throw new Error("No events provided to decision resolver");
      }
      const { events, seed, topK } = args;
      const decisions = decideFromEvents(events,{seed, topK});
      return {
        options: decisions.map(decision =>({
          allocation: Object.entries(decision.allocation).map(([agentId, amount])=> ({agentId, amount})),
          score: decision.score,
          reasons: decision.reason
        }))
      }
    }
  }
};

