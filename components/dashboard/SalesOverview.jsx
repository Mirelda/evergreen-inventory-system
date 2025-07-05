import { Check, CheckCircle2 } from "lucide-react";

function SalesOverview() {
  return (
    <div className="bg-blue-100 border-b border-slate-300 p-8 grid grid-cols-12">
      {/* sales activity */}
      <div className="col-span-8">
        <h2 className="mb-6 text-xl">Sales Activity</h2>
        <div className="grid grid-cols-4">
          {/* card */}
          <div className="rounded-lg bg-white border border-slate-200 hover:border-blue-400 p-8 cursor-pointer flex items-center flex-col gap-3 transition-all duration-300">
            <h4 className="font-semibold text-4xl">10</h4>
            <small className="text-slate-500">Qty</small>
            <div className="flex items-center space-x-2 text-slate-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="uppercase">To be packed</span>
            </div>
          </div>
        </div>
      </div>
      {/* inventory summary */}
    </div>
  );
}

export default SalesOverview;
