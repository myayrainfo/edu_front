import { AuthProvider, useUnifiedAuth } from "../../core/auth/AuthContext";

export { AuthProvider };

export function useAuth() {
  return useUnifiedAuth().admin;
}
