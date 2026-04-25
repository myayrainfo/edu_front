import { useEffect, useState } from "react";
import { Alert, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import LogoMark from "../../components/common/LogoMark";
import RoleCard from "../../components/auth/RoleCard";
import { roleOptions } from "../../data/erpData";
import { useAuth } from "../../context/AuthContext";
import { adminLoginPath, userPath } from "../../../core/config/panelPaths";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant: tenantParam } = useParams();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, session, authLoading } = useAuth();
  const tenantName = tenantParam || searchParams.get("tenant") || "cgu";
  const initialRole = searchParams.get("role") || "student";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    tenant: tenantName,
    role: initialRole,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [pointerGlow, setPointerGlow] = useState({
    x: 0,
    y: 0,
    active: false,
  });
  const activeRole = roleOptions.find((role) => role.value === formData.role) || null;
  const roleQuotes = {
    student: "Learning opens every next door.",
    teacher: "Guide with clarity, lead with purpose.",
    academic: "Structure creates the path to excellence.",
    communication: "The right message can move an entire campus.",
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      setPointerGlow({
        x: event.clientX,
        y: event.clientY,
        active: true,
      });
    };

    const handlePointerLeave = () => {
      setPointerGlow((current) => ({ ...current, active: false }));
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  if (isAuthenticated) {
    const target =
      location.state?.from?.pathname ||
      userPath(`${session?.tenantSlug || tenantName}/${session?.role || "student"}/dashboard`);
    return <Navigate to={target} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(formData);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setIsLeaving(true);
    const target = location.state?.from?.pathname || userPath(`${formData.tenant}/${formData.role}/dashboard`);
    window.setTimeout(() => {
      navigate(target, { replace: true });
    }, 220);
  };

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.2),_transparent_30%),linear-gradient(160deg,_#ecfeff_0%,_#f8fafc_45%,_#ecfdf5_100%)] transition-all duration-500 ease-out ${isLeaving ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div
        className={`pointer-events-none fixed left-0 top-0 z-20 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-[opacity,transform,background] duration-200 ${pointerGlow.active ? "opacity-100" : "opacity-0"}`}
        style={{
          left: `${pointerGlow.x}px`,
          top: `${pointerGlow.y}px`,
          background:
            pointerGlow.x <= (typeof window !== "undefined" ? window.innerWidth / 2 : Number.POSITIVE_INFINITY)
              ? "radial-gradient(circle, rgba(255,255,255,0.82), rgba(255,255,255,0.34) 38%, rgba(255,255,255,0.12) 60%, transparent 78%)"
              : "radial-gradient(circle, rgba(147,197,253,0.85), rgba(96,165,250,0.36) 38%, rgba(59,130,246,0.16) 60%, transparent 78%)",
          mixBlendMode:
            pointerGlow.x <= (typeof window !== "undefined" ? window.innerWidth / 2 : Number.POSITIVE_INFINITY)
              ? "screen"
              : "multiply",
        }}
      />

      <div className="grid min-h-screen w-full items-stretch gap-0 lg:grid-cols-2">
        <section className="relative z-10 flex overflow-hidden bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.22),_transparent_35%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <LogoMark inverted />

            <div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-teal-200/80 sm:text-sm">
                User Portal
              </p>
              <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl xl:text-[2.8rem]">
                One frontend experience for every university user role.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                This setup gives you a professional ERP user portal with a clean login, tenant-aware access,
                role-based dashboards, quick actions, notices, operational views, and room to connect your
                backend later.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Role-specific dashboard content",
                  "Single login flow for all user types",
                  "Search, navigation, widgets, and tables",
                  "Ready to connect with backend auth later",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-slate-100 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Users", value: "4", note: "Student, teacher, academic, communication" },
                  { label: "Tenant-Aware", value: "1+", note: "Fixed to cgu for now, super admin can expand later" },
                  { label: "Frontend Ready", value: "Now", note: "Use this structure before backend integration" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/10 p-3">
                    <p className="text-sm uppercase tracking-[0.2em] text-teal-100/70">{item.label}</p>
                    <p className="mt-1.5 text-2xl font-extrabold">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-300 sm:text-sm">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 flex min-h-screen flex-col bg-white/82 p-5 shadow-2xl shadow-teal-950/10 backdrop-blur sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700/70">Login</p>
              <h2 className="mt-1.5 text-2xl font-extrabold text-slate-950 sm:text-3xl">Choose your portal</h2>
            </div>
            <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500 sm:block">
              Demo mode
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            "Choose your role, step into your workspace, and keep the journey simple."
          </p>

          {error ? <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert> : null}

          <div className="mt-5 flex-1 overflow-y-auto">
            {!formData.role ? (
              <div className="grid gap-4 md:grid-cols-2">
                {roleOptions.map((role, index) => (
                  <RoleCard
                    key={role.value}
                    role={role}
                    active={false}
                    index={index}
                    onSelect={(value) => {
                      setFormData((current) => ({ ...current, role: value }));
                      setError("");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="animate-panel-float h-full rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 shadow-inner shadow-white sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700/75">
                      Login Details
                    </p>
                    <h3 className="mt-2 text-2xl font-extrabold text-slate-950">
                      {activeRole?.label} sign in
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                      "{roleQuotes[formData.role] || "A calm, focused login experience designed for you."}"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((current) => ({ ...current, role: "" }));
                      setError("");
                    }}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
                  >
                    Change role
                  </button>
                </div>

                <div className="mt-5">
                  <RoleCard
                    role={activeRole}
                    active
                    index={0}
                    onSelect={() => {}}
                  />
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={(event) => {
                      setFormData({ ...formData, username: event.target.value });
                      setError("");
                    }}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(event) => {
                      setFormData({ ...formData, password: event.target.value });
                      setError("");
                    }}
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((current) => !current)}
                          >
                            {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Tenant"
                    name="tenant"
                    value={formData.tenant}
                    onChange={(event) => setFormData({ ...formData, tenant: event.target.value.toLowerCase() })}
                    helperText="Use cgu for local development."
                    required
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<LoginRoundedIcon />}
                    disabled={authLoading}
                    sx={{
                      py: 1.6,
                      background: "linear-gradient(135deg, #0f766e 0%, #1d4ed8 100%)",
                    }}
                  >
                    {authLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>
                    Role:{" "}
                    <strong className="text-slate-900">
                      {activeRole?.label || "Not selected"}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(adminLoginPath())}
                    className="font-semibold text-teal-700"
                  >
                    Admin login
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
