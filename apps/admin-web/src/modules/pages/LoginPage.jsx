import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Alert, Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { adminPath } from "../../core/config/panelPaths";

const branchOptions = [
  {
    id: "masterAdmin",
    title: "Master Admin",
    subtitle: "System-wide control",
    description: "Manage users, permissions, tenant settings, and platform-wide operations.",
    icon: AdminPanelSettingsOutlinedIcon,
    accent: "#67e8f9",
    glow: "rgba(103, 232, 249, 0.2)",
    enabled: true,
  },
  {
    id: "academics",
    title: "Academics",
    subtitle: "Academic operations",
    description: "Handle course planning, timetables, exams, and curriculum workflows.",
    icon: SchoolOutlinedIcon,
    accent: "#2dd4bf",
    glow: "rgba(45, 212, 191, 0.18)",
    enabled: true,
  },
  {
    id: "accounts",
    title: "Accounts",
    subtitle: "Finance desk",
    description: "Track collections, fee records, dues, receipts, and finance approvals.",
    icon: AccountBalanceWalletOutlinedIcon,
    accent: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.18)",
    enabled: false,
  },
  {
    id: "hr",
    title: "HR",
    subtitle: "People administration",
    description: "Manage staff profiles, onboarding, leave approvals, and department staffing.",
    icon: BadgeOutlinedIcon,
    accent: "#fda4af",
    glow: "rgba(253, 164, 175, 0.18)",
    enabled: false,
  },
];

const initialRegisterData = {
  name: "",
  email: "",
  phone: "",
  username: "",
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#dbe4f0",
    },
    "&:hover fieldset": {
      borderColor: "#94a3b8",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 4px rgba(37,99,235,0.12)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
    },
  },
};

export default function LoginPage() {
  const { login, loginError, setLoginError, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [portalAccess, setPortalAccess] = useState({
    accounts: false,
    hr: false,
    academics: false,
    masterAdmin: true,
  });
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [infoMessage, setInfoMessage] = useState("");

  const branches = useMemo(
    () =>
      branchOptions.map((branch) => ({
        ...branch,
        enabled: branch.id === "masterAdmin" ? true : Boolean(portalAccess[branch.id]),
      })),
    [portalAccess],
  );

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranch) || null,
    [branches, selectedBranch],
  );

  useEffect(() => {
    setLoginError("");
    setInfoMessage("");
  }, [selectedBranch, activeMode, setLoginError]);

  useEffect(() => {
    const loadPortalAccess = async () => {
      try {
        const { data } = await api.get("/auth/portal-settings");
        setPortalAccess(data.data.portalAccess);
      } catch {
        // Keep defaults.
      }
    };

    loadPortalAccess();
  }, []);

  if (user) {
    return <Navigate to={user.portal === "accounts" ? adminPath("finance") : adminPath("dashboard")} replace />;
  }

  const handleBranchSelect = (branchId) => {
    const branch = branches.find((item) => item.id === branchId);
    if (!branch || !branch.enabled) return;
    setSelectedBranch(branchId);
    setActiveMode(null);
  };

  const handleBackToPanels = () => {
    setSelectedBranch(null);
    setActiveMode(null);
    setUsername("");
    setPassword("");
    setRegisterData(initialRegisterData);
    setShowPassword(false);
    setLoginError("");
    setInfoMessage("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    await login(username, password, selectedBranch === "masterAdmin" ? "ADMIN" : null, selectedBranch || "masterAdmin");
    setLoading(false);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (!activeBranch) return;
    setInfoMessage(
      `${activeBranch.title} registration is currently reviewed by the Master Admin. Please create this account from the admin management panel or enable a public registration API first.`,
    );
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-1/2"
        style={{ background: "linear-gradient(145deg, #08111f 0%, #10243a 42%, #123950 72%, #0f766e 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.22),_transparent_32%),radial-gradient(circle_at_85%_20%,_rgba(103,232,249,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.16),_transparent_30%)]" />
          <div className="absolute -left-16 -top-24 h-80 w-80 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full border border-cyan-200/10 bg-cyan-200/5 blur-3xl" />
          <div className="absolute bottom-8 left-8 h-56 w-56 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          <div className="absolute inset-y-0 right-20 w-px bg-white/10" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_16px_40px_rgba(8,17,31,0.35)]">
              <SchoolOutlinedIcon sx={{ fontSize: 22, color: "white" }} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-white">AYRA ERP</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Admin Command Center</p>
            </div>
          </div>

          <div className="max-w-lg space-y-8">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/80">Education ERP Platform</p>
              <h1 className="text-5xl font-extrabold leading-[1.05] text-white">
                Manage your
                <br />
                institution with
                <br />
                <span className="text-cyan-200">clarity and control.</span>
              </h1>
            </div>

            <p className="max-w-md text-base leading-relaxed text-slate-200/85">
              A unified administrative workspace for academics, accounts, HR, and campus operations built for modern
              education institutions.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {branches.map((branch) => {
                const Icon = branch.icon;
                const isActive = selectedBranch === branch.id;
                const isDisabled = !branch.enabled;

                return (
                  <div
                    key={branch.id}
                    className={`rounded-3xl border px-4 py-4 backdrop-blur-md transition-all ${
                      isActive
                        ? "border-white/25 bg-white/14 shadow-[0_22px_50px_rgba(6,11,22,0.32)]"
                        : isDisabled
                          ? "border-white/8 bg-white/5 opacity-60"
                          : "border-white/10 bg-white/6"
                    }`}
                    style={{ boxShadow: isActive ? `0 16px 44px ${branch.glow}` : undefined }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{branch.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300/70">{branch.subtitle}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10"
                          style={{ backgroundColor: branch.glow }}
                        >
                          <Icon sx={{ fontSize: 20, color: branch.accent }} />
                        </div>
                        {branch.enabled ? null : (
                          <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200/75">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-200/80">{branch.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {["Master Admin", "Academics", "Accounts", "HR"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-100 backdrop-blur-md"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6 lg:p-12">
        <div className="w-full max-w-xl animate-fadeInUp">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
              <SchoolOutlinedIcon sx={{ fontSize: 22, color: "white" }} />
            </div>
            <span className="text-xl font-bold text-slate-900">AYRA ERP</span>
          </div>

          <div className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
            {activeBranch ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleBackToPanels}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
                  >
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                    Back to panels
                  </button>
                </div>

                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Selected panel</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{activeBranch.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{activeBranch.description}</p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: activeBranch.glow }}>
                    {(() => {
                      const ActiveIcon = activeBranch.icon;
                      return <ActiveIcon sx={{ fontSize: 24, color: activeBranch.accent }} />;
                    })()}
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <Button variant={activeMode === "signin" ? "contained" : "outlined"} onClick={() => setActiveMode("signin")} sx={{ py: 1.3, borderRadius: "16px" }}>
                    Sign in
                  </Button>
                  <Button variant={activeMode === "register" ? "contained" : "outlined"} onClick={() => setActiveMode("register")} sx={{ py: 1.3, borderRadius: "16px" }}>
                    Register
                  </Button>
                </div>

                {loginError && activeMode === "signin" ? (
                  <Alert severity="error" className="mb-5" onClose={() => setLoginError("")}>
                    {loginError}
                  </Alert>
                ) : null}

                {infoMessage && activeMode === "register" ? (
                  <Alert severity="info" className="mb-5" onClose={() => setInfoMessage("")}>
                    {infoMessage}
                  </Alert>
                ) : null}

                {activeMode === "signin" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <TextField
                      fullWidth
                      label="Username or email"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      helperText={`Signing in to ${activeBranch.title}`}
                      sx={textFieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      sx={textFieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((value) => !value)} edge="end" size="small">
                              {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded accent-indigo-600" />
                        <span className="text-sm text-slate-600">Remember me</span>
                      </label>
                      <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Forgot password?
                      </button>
                    </div>

                    <Button type="submit" variant="contained" fullWidth disabled={loading || !username || !password} sx={{ mt: 1, py: 1.4, fontSize: "0.95rem", fontWeight: 600, borderRadius: "16px" }}>
                      {loading ? <CircularProgress size={20} color="inherit" /> : `Sign in to ${activeBranch.title}`}
                    </Button>
                  </form>
                ) : activeMode === "register" ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <TextField fullWidth label="Full name" value={registerData.name} onChange={(event) => setRegisterData((current) => ({ ...current, name: event.target.value }))} sx={textFieldSx} />
                      <TextField fullWidth label="Preferred username" value={registerData.username} onChange={(event) => setRegisterData((current) => ({ ...current, username: event.target.value }))} sx={textFieldSx} />
                      <TextField fullWidth label="Email" type="email" value={registerData.email} onChange={(event) => setRegisterData((current) => ({ ...current, email: event.target.value }))} sx={textFieldSx} />
                      <TextField fullWidth label="Phone" value={registerData.phone} onChange={(event) => setRegisterData((current) => ({ ...current, phone: event.target.value }))} sx={textFieldSx} />
                    </div>

                    <Alert severity="warning">
                      Public registration is not connected to the backend yet. This screen is ready for the branch-based
                      flow, but account creation still needs either a public registration API or an internal approval
                      workflow.
                    </Alert>

                    <Button type="submit" variant="contained" fullWidth disabled={!registerData.name || !registerData.username || !registerData.email} sx={{ py: 1.4, fontSize: "0.95rem", fontWeight: 600, borderRadius: "16px" }}>
                      Request {activeBranch.title} access
                    </Button>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-500">
                    Choose whether you want to sign in or register for the selected panel.
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Choose admin panel</p>
                  <h2 className="text-3xl font-bold text-slate-900">Access your branch workspace</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Select a panel first. Once you click one, this same area will switch into the branch login flow.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {branches.map((branch) => {
                    const Icon = branch.icon;
                    const isDisabled = !branch.enabled;

                    return (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => handleBranchSelect(branch.id)}
                        disabled={isDisabled}
                        className={`rounded-3xl border p-4 text-left transition-all ${
                          isDisabled
                            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{branch.title}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{branch.subtitle}</p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100" style={{ color: branch.accent }}>
                              <Icon sx={{ fontSize: 20, color: branch.accent }} />
                            </div>
                            {branch.enabled ? null : (
                              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  Portal availability here follows the live settings configured by the Master Admin in the portal access
                  section.
                </div>
              </>
            )}

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-center text-xs text-slate-400">
                Default admin login still works after selecting a panel. Contact{" "}
                <span className="font-mono text-slate-600">myayrainfo@gmail.com</span> in backend to create the seeded
                account.
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} AYRA ERP · University Administration System</p>
        </div>
      </div>
    </div>
  );
}
