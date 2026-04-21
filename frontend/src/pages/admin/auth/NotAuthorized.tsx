import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: "#F3F3F3",
        fontFamily:
          "'Times New Roman', sans-serif, Geist, 'Geist Placeholder', Inter, 'Inter Placeholder', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', ui-sans-serif, system-ui",
      }}
    >
      <div className="w-full max-w-lg">
        <div
          className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border text-center"
          style={{ borderColor: "rgba(8, 29, 58, 0.08)" }}
        >
          {/* Header Icon */}
          <div className="flex justify-center mb-10">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
              style={{ backgroundColor: "rgba(246, 227, 4, 0.15)" }}
            >
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-20"
                style={{ backgroundColor: "#F6E304" }}
              />
              <Lock size={36} color="#081D3A" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{
                backgroundColor: "#081D3A",
                color: "#F6E304",
              }}
            >
              Access Restricted
            </div>
          </div>

          <h1
            className="text-4xl font-bold mb-5 tracking-tight"
            style={{ color: "#000000" }}
          >
            403 <span className="font-light text-gray-300">|</span> Unauthorized
          </h1>

          <p
            className="text-sm leading-relaxed max-w-sm mx-auto mb-12"
            style={{ color: "rgba(23, 23, 26, 0.6)" }}
          >
            Your account does not have the necessary administrative privileges
            to access this secure resource. Please contact your administrator if
            you believe this is an error.
          </p>

          {/* Divider */}
          <div
            className="w-12 h-1 mx-auto mb-12 rounded-full"
            style={{ backgroundColor: "#F6E304" }}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/admin/login")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-center gap-2.5 hover:bg-gray-50 active:scale-95"
              style={{
                borderColor: "rgba(8, 29, 58, 0.15)",
                color: "#081D3A",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={16} />
              Go to Login
            </button>
          </div>
        </div>

        {/* Support Link */}
        <p
          className="mt-8 text-center text-[10px] uppercase font-bold tracking-widest opacity-30"
          style={{ color: "#17171A" }}
        >
          ServiceHub Administrative Security Protocol
        </p>
      </div>
    </div>
  );
}
