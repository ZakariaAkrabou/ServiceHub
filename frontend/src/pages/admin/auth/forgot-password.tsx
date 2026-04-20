import { useState } from "react";
import {
  Mail,
  ArrowLeft,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useForgotPasswordMutation } from "../../../app/api/AuthApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await forgotPassword(email).unwrap();
      setIsLoading(false);
      setIsSent(true);
    } catch (err: any) {
      setIsLoading(false);
      if (
        typeof err === "object" &&
        err &&
        "data" in err &&
        typeof err.data === "string"
      ) {
        setError(err.data);
      } else if (
        typeof err === "object" &&
        err &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data.message
      ) {
        setError(err.data.message);
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#ffffff",
        fontFamily:
          "'Times New Roman', sans-serif, Geist, 'Geist Placeholder', Inter, 'Inter Placeholder', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', ui-sans-serif, system-ui",
      }}
    >
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden"
        style={{ backgroundColor: "#F3F3F3" }}
      >
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ backgroundColor: "#F6E304" }}
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: "#081D3A" }}
        />
        <div
          className="absolute top-1/2 -right-15 w-48 h-48 rounded-full opacity-15"
          style={{ backgroundColor: "#F6E304" }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#F6E304" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className="text-xl font-bold tracking-wide"
            style={{ color: "#000000" }}
          >
            ServiceHub
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "rgba(246, 227, 4, 0.3)",
              color: "#17171A",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Admin Portal
          </div>
          <h1
            className="text-4xl font-bold leading-tight"
            style={{ color: "#081D3A" }}
          >
            Manage your
            <br />
            <span
              style={{
                color: "#17171A",
                borderBottom: "4px solid #F6E304",
                paddingBottom: "2px",
              }}
            >
              service
            </span>{" "}
            network
            <br />
            with confidence.
          </h1>
          <p
            className="text-base leading-relaxed max-w-sm"
            style={{ color: "#17171A" }}
          >
            Access real-time dashboards, oversee providers, track orders, and
            keep your platform running smoothly — all from one place.
          </p>
        </div>

        <p
          className="relative z-10 text-xs"
          style={{ color: "rgba(8, 29, 58, 0.4)" }}
        >
          © 2026 ServiceHub — All rights reserved
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#F6E304" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ color: "#000000" }}>
              ServiceHub
            </span>
          </div>

          <a
            href="/admin/login"
            className="inline-flex items-center gap-2 mb-6 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: "#17171A" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </a>

          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-1"
              style={{ color: "#000000" }}
            >
              Reset password
            </h2>
            <p className="text-sm" style={{ color: "#17171A" }}>
              {isSent
                ? "Check your email for a reset link"
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          <div
            className="rounded-2xl p-8 shadow-sm border"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "rgba(8, 29, 58, 0.1)",
              boxShadow: "0 4px 32px rgba(8, 29, 58, 0.05)",
            }}
          >
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium"
                    style={{ color: "#000000" }}
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail className="w-4 h-4" style={{ color: "#17171A" }} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="admin@servicehub.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "#F3F3F3",
                        border: "1.5px solid rgba(8, 29, 58, 0.15)",
                        color: "#000000",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#F6E304";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(246, 227, 4, 0.2)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(8, 29, 58, 0.15)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <button
                  id="reset-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                  style={{
                    backgroundColor: isLoading ? "#17171A" : "#081D3A",
                    color: "#F3F3F3",
                    opacity: isLoading ? 0.75 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(8, 29, 58, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#000000";
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#081D3A";
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        stroke="rgba(243, 243, 243, 0.8)"
                      />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                {error && (
                  <div className="mt-3 text-sm text-red-600 text-center font-semibold">
                    {error}
                  </div>
                )}
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(246, 227, 4, 0.2)" }}
                >
                  <Mail className="w-8 h-8" style={{ color: "#081D3A" }} />
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#000000" }}
                >
                  Check your inbox
                </h3>
                <p className="text-sm mb-6" style={{ color: "#17171A" }}>
                  We've sent a password reset link to <br />
                  <span className="font-semibold">{email}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#F3F3F3",
                    color: "#081D3A",
                    border: "1.5px solid rgba(8, 29, 58, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#F6E304";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(8, 29, 58, 0.15)";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#F3F3F3";
                  }}
                >
                  Try another email
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "rgba(8, 29, 58, 0.1)" }}
            />
            <span className="text-xs" style={{ color: "#17171A" }}>
              admin access only
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "rgba(8, 29, 58, 0.1)" }}
            />
          </div>

          {/* Security note */}
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
            style={{
              backgroundColor: "rgba(246, 227, 4, 0.1)",
              border: "1px solid rgba(246, 227, 4, 0.3)",
            }}
          >
            <ShieldCheck
              className="w-4 h-4 mt-0.5 shrink-0"
              style={{ color: "#081D3A" }}
            />
            <p className="text-xs leading-relaxed" style={{ color: "#17171A" }}>
              Your session is protected with end-to-end encryption. Unauthorized
              access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
