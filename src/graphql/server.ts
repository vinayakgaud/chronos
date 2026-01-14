//GraphQL Runtime (the execution engine)
/**GraphQL has two layers:

Schema definition (types)

Schema execution (resolvers)

Apollo mixes them for convenience.
Yoga forces you to be explicit. */
//Yoga expects a fully executable schema
/*“Yoga does NOT accept resolvers directly.
Give me a fully-built schema. I don’t assemble schemas for you.”*/

import { createYoga } from "graphql-yoga";
import { executableSchema } from "./executableSchema.js";

export const yogaServer = createYoga({
  schema: executableSchema,
  maskedErrors: false, //Step 1 - Make the error visible (critical)
})
