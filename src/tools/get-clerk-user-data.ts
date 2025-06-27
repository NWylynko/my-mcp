import type { McpServer } from "@/app/[transport]/route";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const clerk = await clerkClient();

export const getClerkUserData = (server: McpServer) => {
  server.registerTool(
    "get-clerk-user-data",
    {
      title: "Get Clerk User Data",
      description:
        "Gets data about the Clerk user that authorized this request",
      inputSchema: {},
      outputSchema: {
        favoriteSnack: z.string().optional(),
      },
    },
    async (_, { authInfo }) => {
      console.log("authInfo", authInfo);

      const userId = authInfo!.extra!.userId! as string;
      const userData = await clerk.users.getUser(userId);

      console.log(userData.privateMetadata);

      return {
        content: [
          { type: "text", text: JSON.stringify(userData.privateMetadata) },
        ],
      };
    }
  );
};
