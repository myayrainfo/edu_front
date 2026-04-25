import { createContext, useContext, useMemo, useState } from "react";

import adminApi from "../../modules/utils/api.js";
import { clearTokens, setTokens } from "./tokenStorage.js";
import { readJsonStorage, writeJsonStorage } from "./authHelpers.js";

const STORAGE_KEY = "erp_admin_user";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJsonStorage(STORAGE_KEY));
  const [loginError, setLoginError] = useState("");

  const value = useMemo(
    () => ({
      admin: {
        user,
        loginError,
        setLoginError,
        async login(username, password, expectedRole = null, portal = "masterAdmin") {
          try {
            const { data } = await adminApi.post("/auth/login", { username, password, portal });
            const { accessToken, refreshToken, admin } = data.data;

            if (expectedRole && String(admin.role || "").toUpperCase() !== String(expectedRole).toUpperCase()) {
              setLoginError("This account does not have access to the selected portal.");
              return false;
            }

            setTokens({ accessToken, refreshToken });
            const nextUser = { ...admin, portal };
            setUser(nextUser);
            writeJsonStorage(STORAGE_KEY, nextUser);
            setLoginError("");
            return true;
          } catch (error) {
            setLoginError(error.response?.data?.message || "Invalid username or password.");
            return false;
          }
        },
        async logout() {
          try {
            await adminApi.post("/auth/logout");
          } catch {
            // ignore logout errors
          }

          clearTokens();
          writeJsonStorage(STORAGE_KEY, null);
          setUser(null);
        },
        updateUser(updatedUser) {
          const nextUser = { ...user, ...updatedUser };
          setUser(nextUser);
          writeJsonStorage(STORAGE_KEY, nextUser);
        },
      },
    }),
    [loginError, user],
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
