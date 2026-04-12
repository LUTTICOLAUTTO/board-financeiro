import HomeLauncher from "@/components/home-launcher";
import { getAllClientSessions } from "@/lib/client-sessions";

export default function HomePage() {
  return <HomeLauncher sessions={getAllClientSessions()} />;
}
