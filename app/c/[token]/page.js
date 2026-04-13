import { hasSessionAccess } from "@/lib/session-auth";
import { notFound } from "next/navigation";

import DiagnosticApp from "@/components/diagnostic-app";
import { getClientSession, getPublicClientSession } from "@/lib/client-sessions";

export default async function ClientSessionPage({ params }) {
  const { token } = await params;
  const privateSession = getClientSession(token);
  const session = getPublicClientSession(token);

  if (!session || !privateSession) {
    notFound();
  }

  return (
    <DiagnosticApp
      accessGranted={hasSessionAccess(token)}
      requiresAuth={Boolean(privateSession.accessCode)}
      session={session}
    />
  );
}
