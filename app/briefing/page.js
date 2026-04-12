import DiagnosticApp from "@/components/diagnostic-app";
import { getDefaultSession } from "@/lib/client-sessions";

export default function GenericBriefingPage() {
  return <DiagnosticApp accessGranted requiresAuth={false} session={getDefaultSession()} />;
}
