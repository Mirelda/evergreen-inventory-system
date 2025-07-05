function InventorySummaryCard({ item }) {
  return (
    <div className="mb-4 rounded-lg bg-white border border-slate-200 hover:border-blue-400 px-4 py-2 cursor-pointer flex items-center  gap-3 justify-between transition-all duration-300">
      <h2 className="text-slate-500 uppercase text-sm">{item.title}</h2>
      <h4 className="text-2xl">{item.number}</h4>
    </div>
  );
}

export default InventorySummaryCard;
