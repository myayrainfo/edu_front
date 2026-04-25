import LogoMark from "../../modules/components/common/LogoMark";

export default function UserAuthLayout({
  badge = "User Access",
  title,
  description,
  features = [],
  children,
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#eef8f4_0%,_#f8fafc_46%,_#edf7f3_100%)]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(160deg,_#08201a_0%,_#0f3d35_46%,_#0e7490_100%)] px-12 py-12 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(125,211,252,0.18),_transparent_32%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <LogoMark inverted />

            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-100/75">
                {badge}
              </p>
              <h1 className="mt-5 max-w-xl text-5xl font-extrabold leading-[1.02] text-white">
                {title}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-200/88">
                {description}
              </p>

              {features.length ? (
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {features.map((item) => (
                    <div
                      key={item}
                      className="rounded-[26px] border border-white/10 bg-white/10 p-4 text-sm font-medium text-slate-100 backdrop-blur-md"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid max-w-lg grid-cols-3 gap-3">
              {[
                { label: "Roles", value: "4" },
                { label: "Tenant", value: "CGU" },
                { label: "Status", value: "Live" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/75">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-white">{item.value}</p>
                </div>
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
