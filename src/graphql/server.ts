import { createYoga } from "graphql-yoga";
import { executableSchema } from "./executableSchema.js";

export const yogaServer = createYoga({
  schema: executableSchema,
  maskedErrors: false, //making error visible for debugging
})
