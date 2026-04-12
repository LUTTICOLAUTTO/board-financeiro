import crypto from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "lampada_admin_access";

function expectedEmail() {
  return process.env.ADMIN_EMAIL || "";
}

function expectedPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function buildAdminCookieValue(email, password) {
  return crypto.createHash("sha256").update(`${email}:${password}`).digest("hex");
}

export function validateAdminCredentials(email, password) {
  return email === expectedEmail() && password === expectedPassword();
}

export function buildAdminCookie() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: buildAdminCookieValue(expectedEmail(), expectedPassword()),
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14
    }
  };
}

export function clearAdminCookie() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    }
  };
}

export function hasAdminAccess() {
  const expected = buildAdminCookieValue(expectedEmail(), expectedPassword());
  const current = cookies().get(ADMIN_COOKIE_NAME)?.value;

  if (!expectedEmail() || !expectedPassword()) {
    return false;
  }

  return current === expected;
}

export function requireAdminAccess() {
  if (!hasAdminAccess()) {
    redirect("/admin/login");
  }
}
