import type { McpServer } from "@/app/[transport]/route";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const clerk = await clerkClient();

export const writeClerkUserData = (server: McpServer) => {
  server.registerTool(
    "write-clerk-user-data",
    {
      title: "Write Clerk User Data",
      description:
        "Writes data about the Clerk user that authorized this request",
      inputSchema: {
        favoriteSnack: z.string().optional(),
      },
    },
    async (input, { authInfo }) => {
      const userId = authInfo!.extra!.userId! as string;

      await clerk.users.updateUserMetadata(userId, {
        privateMetadata: {
          favoriteSnack: input.favoriteSnack,
        },
      });

      return {
        content: [{ type: "text", text: "Data written" }],
      };
    }
  );
};
