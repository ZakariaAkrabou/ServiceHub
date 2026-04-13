import { ChevronDown } from "lucide-react";

export default function Header() {
    return (
        <header className="flex items-center justify-between w-full h-22 mb-2 shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>

            <div className="flex items-center gap-4">
                <button className="bg-white px-4 py-2.5 rounded-xl text-[13px] font-semibold text-gray-600 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                    10-06-2021
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="bg-white px-4 py-2.5 rounded-xl text-[13px] font-semibold text-gray-600 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                    10-10-2021
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </header>
    );
}