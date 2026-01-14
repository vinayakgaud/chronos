import { makeExecutableSchema } from "@graphql-tools/schema";
import {typeDefinitionSchema} from "./schema.js";
import {resolvers} from "./resolvers.js";

export const executableSchema = makeExecutableSchema({
  typeDefs: typeDefinitionSchema,
  resolvers
})

/**Final takeaway (pin this)

Yoga does NOT accept resolvers

Yoga accepts only executable schemas

makeExecutableSchema is the canonical solution

rootValue is legacy

Your resolver logic was already correct

Your mental model just leveled up */
