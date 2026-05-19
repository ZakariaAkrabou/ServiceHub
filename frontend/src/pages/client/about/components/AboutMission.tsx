import missionImage from "../../../../assets/mission.jpg";
import teamImage from "../../../../assets/stock.jpg";
import { ArrowRight } from "lucide-react";

const AboutMission: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#f8f6f1] py-16 px-5 lg:px-12"
      style={{
        fontFamily:
          '"Times New Roman", sans-serif, Geist, "Geist Placeholder", Inter, "Inter Placeholder", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      }}
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[#d4b46a]/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#1a1a2e]/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="space-y-9 ">
          <div className="flex items-center gap-3 ml-0">
            <span className="h-[2px] w-10 bg-[#c9a84c]" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: "#1a1a2e",
                textTransform: "uppercase",
                fontFamily:
                  '"Times New Roman", sans-serif, Geist, "Geist Placeholder", Inter, "Inter Placeholder", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              }}
            >
              About Our Platform
            </span>
          </div>

          <div className="space-y-5">
            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] text-[#1a1a1a] sm:text-4xl lg:text-5xl">
              Local services made
              <span className="block text-[#c9a84c]">simple, fast</span>
              and trustworthy.
            </h2>

            <p className="max-w-lg text-sm leading-7 text-[#5f5f5f] sm:text-base">
              We help users connect instantly with qualified professionals for
              maintenance, repairs, and everyday assistance — all from one
              reliable platform.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e9e3d3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#c9a84c]/10 text-[#c9a84c]">
                01
              </div>

              <h3 className="mb-3 text-lg font-extrabold text-[#1a1a1a]">
                Our Mission
              </h3>

              <p className="text-sm leading-6 text-[#666]">
                Simplify access to trusted local services through a transparent,
                user-friendly experience focused on speed, quality, and trust.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e3d3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#1a1a2e]/5 text-[#1a1a2e]">
                02
              </div>

              <h3 className="mb-3 text-lg font-extrabold text-[#1a1a1a]">
                Our Vision
              </h3>

              <p className="text-sm leading-6 text-[#666]">
                Build a connected ecosystem where every local need can be solved
                quickly by skilled professionals near you.
              </p>
            </div>
          </div>

          <button className="group inline-flex items-center gap-0 rounded-full bg-[#c9a84c] px-7 py-2.5 text-sm font-semibold text-[#1a1a2e] transition-all duration-300 hover:shadow-lg"
            style={{
              boxShadow: "0 4px 16px rgba(201,168,76,0.12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 6px rgba(201,168,76,0.18), 0 8px 32px rgba(201,168,76,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,168,76,0.12)";
            }}
          >
            <span style={{ marginRight: 16 }}>Explore Services</span>
            <span
              className="group-hover:rotate-45"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#1a1a2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "transform 0.3s ease",
              }}
            >
              <ArrowRight className="h-4 w-4 text-[#c9a84c] transition-transform duration-300" />
            </span>
          </button>
        </div>

        {/* RIGHT VISUALS */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-2xl">
            {/* Main Image */}
            <div className="overflow-hidden rounded-[24px] shadow-2xl">
              <img
                src={missionImage}
                alt="Local service mission"
                className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
