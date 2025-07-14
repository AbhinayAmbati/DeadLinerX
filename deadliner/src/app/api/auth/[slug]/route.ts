import { createAuthRouteHandlers } from "@/lib/aws-config";

export const { GET } = createAuthRouteHandlers({
  redirectOnSignInComplete: "/dashboard",
  redirectOnSignOutComplete: "/signin",
}); 