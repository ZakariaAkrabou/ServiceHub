import React from "react";
import { type LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: "bg-[#F6E304] text-[#081D3A] shadow-[0_10px_30px_rgba(246,227,4,0.2)] hover:bg-[#081D3A] hover:text-[#F6E304] hover:shadow-xl",
  secondary: "bg-[#081D3A] text-white shadow-[0_10px_30px_rgba(8,29,58,0.1)] hover:bg-[#F6E304] hover:text-[#081D3A] hover:shadow-xl",
  outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-[#081D3A] hover:text-[#081D3A] hover:bg-slate-50",
  ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
  danger: "bg-rose-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.2)] hover:bg-rose-600",
};

const sizes = {
  xs: "px-3 py-1.5 text-[8px]",
  sm: "px-4 py-2 text-[9px]",
  md: "px-6 py-3 text-[10px]",
  lg: "px-8 py-4 text-[11px]",
  xl: "px-10 py-5 text-[12px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      isLoading = false,
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = "relative inline-flex items-center justify-center font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer group overflow-hidden";
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {/* Subtle Inner Glow Layer */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="opacity-70">Processing...</span>
          </div>
        ) : (
          <div className="relative flex items-center justify-center gap-2.5">
            {Icon && iconPosition === "left" && (
              <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" />
            )}
            
            <span>{children}</span>
            
            {Icon && iconPosition === "right" && (
              <Icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
