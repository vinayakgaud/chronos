//Resolvers (thin, honest layer)
//“Given this question, how do we compute the answer?”

import decide from "../engine/engineFunction";
import { type PrimitiveEvent } from "../engine/types/primitiveEvents";

export const resolvers = {
  Query: {
    decision: (_parent: unknown, args: {events: PrimitiveEvent[]})=>{
      //non short hand form
      /**
       * decision: (
          _parent: unknown,
          args: { events: PrimitiveEvent[] }
        ) => {
          const events = args.events;
      */
      if(!args || !args?.events){
        throw new Error("No events provided to decision resolver");
      }
      const { events } = args;
      console.log("Incoming events:", events);
      const decisions = decide(events);
      console.log("Decisions:", decisions);
      return {
        options: decisions.map(decision =>({
          allocation: Object.entries(decision.allocation).map(([agentId, amount])=> ({agentId, amount})),
          score: decision.score,
          valid: decision.valid,
          reasons: decision.reason
        }))
      }
    }
  }
}
//{events}: {events: PrimitiveEvent[]} //in yoga write in correct resolver signature
/**
 * error received, storing for future references:
 * {
    "message": "Unexpected error.",
    "path": ["decision"],
    "code": "INTERNAL_SERVER_ERROR"
  }
“The GraphQL query shape is valid,
but your resolver threw an exception at runtime.”
 */
//first principle 
/**
 * If GraphQL returns INTERNAL_SERVER_ERROR,
the bug is always in your resolver or the code it calls.
 */

//Step 1 - Make the error visible (critical) using maskedErrors
// actual error after setting maskedErrors to false:
/**
 * {
  "errors": [
      {
        "message": "Cannot destructure property 'events' from null or undefined value",
        "path": [
          "decision"
        ]
      }
    ],
    "data": null
  }
 */
