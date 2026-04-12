"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST"
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button className="ghost-button" onClick={handleLogout} type="button">
      Sair
    </button>
  );
}
