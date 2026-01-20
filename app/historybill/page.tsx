import HistoryStats from "@/components/History/HistorySate"
import HistoryTable from "@/components/History/HistoryTable"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

const historybillPage = async () => {
    const paidInvoices = await prisma.invoice.findMany({
        where: {
            status: "PAID"
        },
        include: {
            tenant: {
                include: {
                    room: true
                }
            }
        },
        orderBy: {
            paidAt: 'desc'
        }
    })

    const totalCollected = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

    return (
        // <section className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">

        //     {/* Header & Total Stats */}
        //     <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        //         <div className="w-full md:w-auto">
        //             <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">ประวัติการชำระเงิน</h1>
        //             <p className="text-slate-500 font-medium">บันทึกรายการรายได้ที่จัดเก็บเรียบร้อยแล้ว</p>
        //         </div>

        //         <div className="w-full md:w-80 bg-emerald-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 flex flex-col justify-center">
        //             <p className="text-emerald-50 text-xs font-bold uppercase tracking-wider mb-1">ยอดรวมที่จัดเก็บได้ (ทั้งหมด)</p>
        //             <h2 className="text-3xl font-black">
        //                 {totalCollected.toLocaleString()} <span className="text-lg font-medium">฿</span>
        //             </h2>
        //         </div>
        //     </div>

        //     {/* Search & Filter Bar (UI Mockup) */}
        //     <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-3xl border border-slate-100">
        //         <div className="flex-1 min-w-[200px] relative">
        //             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        //             <input
        //                 type="text"
        //                 placeholder="ค้นหาเลขห้อง หรือชื่อผู้เช่า..."
        //                 className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm"
        //             />
        //         </div>
        //         <select className="bg-slate-50 border-none rounded-2xl py-2 px-4 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500">
        //             <option>ทุกเดือน</option>
        //             <option>มกราคม</option>
        //             {/* ... ตัวเลือกเดือน ... */}
        //         </select>
        //     </div>

        //     {/* History Table */}
        //     <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        //         <div className="overflow-x-auto">
        //             <table className="w-full text-left">
        //                 <thead>
        //                     <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
        //                         <th className="py-5 px-8">วันที่ชำระ</th>
        //                         <th className="py-5 px-6">ห้อง / ผู้เช่า</th>
        //                         <th className="py-5 px-6 text-right">จำนวนเงิน</th>
        //                         <th className="py-5 px-6 text-center">หลักฐาน</th>
        //                         <th className="py-5 px-8 text-right">Action</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody className="divide-y divide-slate-50">
        //                     {paidInvoices.map((inv) => (
        //                         <tr key={inv.id} className="group hover:bg-emerald-50/30 transition-colors">
        //                             <td className="py-5 px-8">
        //                                 <p className="font-bold text-slate-700">
        //                                     {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}
        //                                 </p>
        //                                 <p className="text-[10px] text-slate-400 font-medium">เวลา {inv.paidAt ? new Date(inv.paidAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
        //                             </td>

        //                             <td className="py-5 px-6">
        //                                 <div className="flex items-center gap-3">
        //                                     <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
        //                                         {inv.tenant.room.number}
        //                                     </div>
        //                                     <div>
        //                                         <p className="font-bold text-slate-800 text-sm md:text-base">{inv.tenant.firstName}</p>
        //                                         <p className="text-xs text-slate-400">รอบบิล {inv.month}/{inv.year}</p>
        //                                     </div>
        //                                 </div>
        //                             </td>

        //                             <td className="py-5 px-6 text-right">
        //                                 <p className="font-black text-emerald-600 text-lg">
        //                                     {inv.totalAmount.toLocaleString()}.-
        //                                 </p>
        //                             </td>

        //                             <td className="py-5 px-6 text-center">
        //                                 <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
        //                                     ✅ เรียบร้อย
        //                                 </span>
        //                             </td>

        //                             <td className="py-5 px-8 text-right">
        //                                 <Link href={`/invoices/${inv.id}`}>
        //                                     <button className="bg-white border-2 border-slate-100 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
        //                                         ดูรายละเอียด
        //                                     </button>
        //                                 </Link>
        //                             </td>
        //                         </tr>
        //                     ))}
        //                 </tbody>
        //             </table>
        //         </div>
        //         {paidInvoices.length === 0 && (
        //             <div className="p-20 text-center">
        //                 <p className="text-slate-400 font-medium">ยังไม่มีข้อมูลการชำระเงินในระบบ</p>
        //             </div>
        //         )}
        //     </div>
        // </section>

        <section className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* 1. ส่วนหัวและสถิติ */}
            <HistoryStats total={totalCollected} />

            {/* 2. ส่วนค้นหา (Client Component) */}
            {/* <SearchFilter /> */}

            {/* 3. ส่วนตารางแสดงข้อมูล */}
            <HistoryTable invoices={paidInvoices} />
        </section>
    )
}
export default historybillPage