import crypto from "node:crypto";

import { cookies } from "next/headers";

import { getClientSession } from "@/lib/client-sessions";

function cookieName(token) {
  return `lampada_access_${token}`;
}

function cookieValue(token, accessCode) {
  return crypto
    .createHash("sha256")
    .update(`${token}:${accessCode}`)
    .digest("hex");
}

export function hasSessionAccess(token) {
  const session = getClientSession(token);

  if (!session) {
    return false;
  }

  if (!session.accessCode) {
    return true;
  }

  const stored = cookies().get(cookieName(token))?.value;
  return stored === cookieValue(token, session.accessCode);
}

export function buildSessionAccessCookie(token, accessCode) {
  return {
    name: cookieName(token),
    value: cookieValue(token, accessCode),
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14
    }
  };
}
