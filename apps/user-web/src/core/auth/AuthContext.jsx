import { createContext, useContext, useMemo, useState } from "react";

import { loginUser } from "../../modules/services/api.js";
import { readJsonStorage, writeJsonStorage } from "./authHelpers.js";

const STORAGE_KEY = "erp-user-session";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readJsonStorage(STORAGE_KEY));
  const [authLoading, setAuthLoading] = useState(false);

  const value = useMemo(
    () => ({
      user: {
        session,
        isAuthenticated: Boolean(session),
        authLoading,
        async login({ username, password, tenant, role }) {
          const normalizedUsername = username.trim();
          const normalizedTenant = tenant.trim();
          const normalizedPassword = password.trim();
          const tenantSlug = normalizedTenant.toLowerCase().replace(/\s+/g, "-");

          if (!normalizedUsername || !normalizedPassword || !normalizedTenant || !role) {
            return { ok: false, message: "Please complete all login fields." };
          }

          try {
            setAuthLoading(true);
            const response = await loginUser({
              tenant: tenantSlug,
              role,
              username: normalizedUsername,
              password: normalizedPassword,
            });

            const nextSession = {
              username: response.user.username,
              tenant: normalizedTenant,
              tenantSlug,
              role: response.user.role,
              displayName: response.user.displayName,
              photoDataUrl: response.user.photoDataUrl || "",
              profile: response.user.profile || null,
              avatarSeed: response.user.displayName.slice(0, 2).toUpperCase(),
              lastLogin: new Date().toISOString(),
            };

            setSession(nextSession);
            writeJsonStorage(STORAGE_KEY, nextSession);
            return { ok: true };
          } catch (error) {
            return { ok: false, message: error.message };
          } finally {
            setAuthLoading(false);
          }
        },
        logout() {
          setSession(null);
          writeJsonStorage(STORAGE_KEY, null);
        },
      },
    }),
    [authLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useUnifiedAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useUnifiedAuth must be used within AuthProvider");
  }

  return context;
}
