import { useState } from "react";
import { useLoginMutation } from "../../../app/api/AuthApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../app/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      setIsLoading(false);
      navigate("/admin/dashboard");
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
        setError("Login failed. Please try again.");
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

          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-1"
              style={{ color: "#000000" }}
            >
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: "#17171A" }}>
              Sign in to your admin account to continue
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ color: "#17171A" }}
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="22,6 12,13 2,6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                    style={{ color: "#000000" }}
                  >
                    Password
                  </label>
                  <a
                    href="/admin/forgot-password"
                    className="text-xs font-medium transition-colors duration-150 hover:underline"
                    style={{ color: "#081D3A" }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ color: "#17171A" }}
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M7 11V7a5 5 0 0 1 10 0v4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 text-sm rounded-xl outline-none transition-all duration-200"
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 transition-opacity hover:opacity-70"
                    style={{ color: "#17171A" }}
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="1"
                          y1="1"
                          x2="23"
                          y2="23"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: "#F6E304" }}
                />
                <label
                  htmlFor="remember"
                  className="text-sm cursor-pointer select-none"
                  style={{ color: "#17171A" }}
                >
                  Keep me signed in
                </label>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
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
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(243, 243, 243, 0.3)"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="#F3F3F3"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in to Dashboard
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
              {error && (
                <div className="mt-3 text-sm text-red-600 text-center font-semibold">
                  {error}
                </div>
              )}
            </form>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 shrink-0"
              style={{ color: "#081D3A" }}
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
