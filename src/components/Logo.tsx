export default function Logo() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#21808D] via-[#1a9eb6] to-[#0d5c6a] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6M5 12a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#21808D] to-[#0d5c6a] bg-clip-text text-transparent">SIP Growth</h1>
        <p className="text-xs font-medium text-slate-500 tracking-wide">Investment Planner</p>
      </div>
    </div>
  );
}
