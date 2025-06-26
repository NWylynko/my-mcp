import { verifyClerkToken } from "@clerk/mcp-tools/next";
import {
  createMcpHandler,
  experimental_withMcpAuth as withMcpAuth,
} from "@vercel/mcp-adapter";
import { auth } from "@clerk/nextjs/server";

import { getClerkUserData } from "@/tools/get-clerk-user-data";

export type McpServer = Parameters<Parameters<typeof createMcpHandler>[0]>[0];

const handler = createMcpHandler((server) => {
  getClerkUserData(server);
});

const authHandler = withMcpAuth(
  handler,
  async (_, token) => {
    const clerkAuth = await auth({ acceptsToken: "oauth_token" });
    return verifyClerkToken(clerkAuth, token);
  },
  {
    required: true,
    resourceMetadataPath: "/.well-known/oauth-protected-resource/mcp",
  }
);

export { authHandler as GET, authHandler as POST };
