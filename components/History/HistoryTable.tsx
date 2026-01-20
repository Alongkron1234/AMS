// components/History/HistoryTable.tsx
import Link from "next/link";

export default function HistoryTable({ invoices }: { invoices: any[] }) {
    if (invoices.length === 0) {
        return (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center shadow-sm">
                <p className="text-slate-400 font-medium text-lg">🔍 ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
                <Link href="/historybill" className="text-emerald-500 text-sm font-bold mt-2 inline-block">ล้างการค้นหา</Link>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <th className="py-5 px-8 border-b border-slate-100">วันที่ชำระ</th>
                            <th className="py-5 px-6 border-b border-slate-100">ห้อง / ผู้เช่า</th>
                            <th className="py-5 px-6 text-right border-b border-slate-100">จำนวนเงิน</th>
                            <th className="py-5 px-8 text-right border-b border-slate-100">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="group hover:bg-emerald-50/30 transition-colors">
                                <td className="py-5 px-8">
                                    <p className="font-bold text-slate-700">
                                        {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">เวลา {inv.paidAt ? new Date(inv.paidAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                                </td>

                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                                            {inv.tenant.room.number}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm md:text-base">{inv.tenant.firstName}</p>
                                            <p className="text-xs text-slate-400">รอบบิล {inv.month}/{inv.year}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-5 px-6 text-right">
                                    <p className="font-black text-emerald-600 text-lg">
                                        {inv.totalAmount.toLocaleString()}.-
                                    </p>
                                </td>

                                <td className="py-5 px-6 text-center">
                                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                                        ✅ เรียบร้อย
                                    </span>
                                </td>

                                <td className="py-5 px-8 text-right">
                                    <Link href={`/invoices/${inv.id}`}>
                                        <button className="bg-white border-2 border-slate-100 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                                            ดูรายละเอียด
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


