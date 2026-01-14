import { serve } from "bun";
import { yogaServer } from "./src/graphql/server";

serve({
  port: 4000,
  fetch: yogaServer.fetch,
});


console.log("GraphQL server running on http://localhost:4000/graphql")
