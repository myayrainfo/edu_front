import { School } from "@mui/icons-material";

export default function AdminAuthLayout({
  badge = "Admin Access",
  title,
  description,
  highlights = [],
  children,
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#eef4ff_0%,_#f8fafc_48%,_#eef3f7_100%)]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(150deg,_#081225_0%,_#0f2743_45%,_#0f766e_100%)] px-12 py-12 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(103,232,249,0.18),_transparent_28%),radial-gradient(circle_at_80%_22%,_rgba(45,212,191,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
                <School sx={{ fontSize: 24, color: "white" }} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-100/70">
                  AYRA ERP
                </p>
                <p className="text-2xl font-extrabold tracking-tight">Admin Console</p>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-100/75">
                {badge}
              </p>
              <h1 className="mt-5 max-w-xl text-5xl font-extrabold leading-[1.02] text-white">
                {title}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-200/88">
                {description}
              </p>

              {highlights.length ? (
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-md"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">
                        {item.eyebrow}
                      </p>
                      <p className="mt-2 text-lg font-bold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200/82">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              {["Control", "Approvals", "Operations", "Security"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>
    </div>
  );
}
