import { makeExecutableSchema } from "@graphql-tools/schema";
import {resolvers} from "./resolvers";
import {readFileSync} from "fs";
import {join} from "path";

const schemaSDL = readFileSync(join(__dirname, "./schema.graphql"),"utf-8");

export const executableSchema = makeExecutableSchema({
  typeDefs: schemaSDL,
  resolvers
})
