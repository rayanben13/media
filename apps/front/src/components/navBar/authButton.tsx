// components/navbar/auth-button.tsx
import { getCurrentUser } from "@/lib/session";
import AuthButtonClient from "./auth-button-client";

export default async function AuthButton() {
  const user = await getCurrentUser();

  return <AuthButtonClient user={user} />;
}
