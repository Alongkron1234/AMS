
export default function HistoryStats({ total }: { total: number }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">ประวัติการชำระเงิน</h1>
        <p className="text-slate-500 font-medium">บันทึกรายการรายได้ที่จัดเก็บเรียบร้อยแล้ว</p>
      </div>
      <div className="w-full md:w-80 bg-emerald-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 flex flex-col justify-center">
        <p className="text-emerald-50 text-xs font-bold uppercase tracking-wider mb-1">ยอดรวมตามเงื่อนไขค้นหา</p>
        <h2 className="text-3xl font-black">
          {total.toLocaleString()} <span className="text-lg font-medium">฿</span>
        </h2>
      </div>
    </div>
  );
}