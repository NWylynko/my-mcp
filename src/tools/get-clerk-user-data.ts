import type { McpServer } from "@/app/[transport]/route";
import { clerkClient } from "@clerk/nextjs/server";

const clerk = await clerkClient();

export const getClerkUserData = (server: McpServer) => {
  server.tool(
    "get-clerk-user-data",
    "Gets data about the Clerk user that authorized this request",
    {},
    async (_, { authInfo }) => {
      const userId = authInfo!.extra!.userId! as string;
      const userData = await clerk.users.getUser(userId);

      return {
        content: [{ type: "text", text: JSON.stringify(userData) }],
      };
    }
  );
};
