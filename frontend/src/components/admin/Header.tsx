import { ChevronDown, Menu } from "lucide-react";
import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2021-06-10"),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2021-10-10"));
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between w-full h-auto min-h-16 mb-4 xl:mb-2 shrink-0">
      <div className="flex items-center gap-3">
        <button
          className="p-2 -ml-2 hover:bg-gray-200 rounded-lg xl:hidden transition-colors"
          style={{ color: "#17171A" }}
          onClick={onMenuClick}
          type="button"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 
          className="text-xl sm:text-2xl font-bold tracking-tight shrink-0"
          style={{ color: "#000000" }}
        >
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <button
            ref={startRef}
            className="w-full sm:w-auto px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold flex justify-between sm:justify-start items-center gap-1 sm:gap-3 shadow-sm cursor-pointer transition-colors"
            style={{ backgroundColor: "#ffffff", color: "#17171A" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(8,29,58,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
            onClick={() => setOpenStart((v) => !v)}
            type="button"
          >
            {startDate ? startDate.toLocaleDateString() : "Select date"}
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" style={{ color: "rgba(8,29,58,0.5)" }} />
          </button>
          {openStart && (
            <div className="absolute z-20 mt-2 right-0">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  setOpenStart(false);
                }}
                inline
                calendarClassName="shadow-lg rounded-xl border border-gray-100 max-w-[calc(100vw-2rem)]"
              />
            </div>
          )}
        </div>
        <div className="relative flex-1 sm:flex-none">
          <button
            ref={endRef}
            className="w-full sm:w-auto px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold flex justify-between sm:justify-start items-center gap-1 sm:gap-3 shadow-sm cursor-pointer transition-colors"
            style={{ backgroundColor: "#ffffff", color: "#17171A" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(8,29,58,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
            onClick={() => setOpenEnd((v) => !v)}
            type="button"
          >
            {endDate ? endDate.toLocaleDateString() : "Select date"}
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" style={{ color: "rgba(8,29,58,0.5)" }} />
          </button>
          {openEnd && (
            <div className="absolute z-20 mt-2 right-0">
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  setEndDate(date);
                  setOpenEnd(false);
                }}
                inline
                calendarClassName="shadow-lg rounded-xl border border-gray-100 max-w-[calc(100vw-2rem)]"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
