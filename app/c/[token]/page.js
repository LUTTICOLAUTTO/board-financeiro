import { hasSessionAccess } from "@/lib/session-auth";
import { notFound } from "next/navigation";

import DiagnosticApp from "@/components/diagnostic-app";
import { getClientSession, getPublicClientSession } from "@/lib/client-sessions";

export default function ClientSessionPage({ params }) {
  const privateSession = getClientSession(params.token);
  const session = getPublicClientSession(params.token);

  if (!session || !privateSession) {
    notFound();
  }

  return (
    <DiagnosticApp
      accessGranted={hasSessionAccess(params.token)}
      requiresAuth={Boolean(privateSession.accessCode)}
      session={session}
    />
  );
}
