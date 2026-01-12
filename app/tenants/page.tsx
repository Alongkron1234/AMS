import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AllTenantsPage() {
  const activeTenants = await prisma.tenant.findMany({
    where: { isActive: true },
    include: { room: true },
    orderBy: { room: { number: 'asc' } }
  })

  const totalDeposit = activeTenants.reduce((sum, tenant) => sum + tenant.deposit, 0)

  return (
    <section className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">ผู้เช่าปัจจุบัน</h1>
          <p className="text-slate-500 text-sm md:text-base">รายชื่อผู้พักอาศัยที่กำลังทำสัญญาอยู่ทั้งหมด</p>
        </div>
        <div className="w-full md:w-auto bg-blue-50 p-4 rounded-2xl border border-blue-100 text-left md:text-right">
          <p className="text-[10px] md:text-xs text-blue-600 font-bold uppercase tracking-wider">เงินมัดจำรวมทั้งหมด</p>
          <p className="text-xl md:text-2xl font-bold text-blue-700">{totalDeposit.toLocaleString()} <span className="text-sm font-normal">บาท</span></p>
        </div>
      </div>

      <div className="hidden md:block bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-4 px-6 text-sm font-semibold text-slate-600">ห้อง</th>
              <th className="py-4 px-6 text-sm font-semibold text-slate-600">ชื่อ-นามสกุล</th>
              <th className="py-4 px-6 text-sm font-semibold text-slate-600">เบอร์โทรศัพท์</th>
              <th className="py-4 px-6 text-sm font-semibold text-slate-600">วันที่เข้าพัก</th>
              <th className="py-4 px-6 text-sm font-semibold text-slate-600">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {activeTenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold">{tenant.room.number}</span>
                </td>
                <td className="py-4 px-6 font-medium text-slate-800">{tenant.firstName} {tenant.lastName}</td>
                <td className="py-4 px-6 text-slate-600 text-sm">{tenant.phone || '-'}</td>
                <td className="py-4 px-6 text-slate-600 text-sm">{new Date(tenant.startDate).toLocaleDateString('th-TH')}</td>
                <td className="py-4 px-6">
                  <Link href={`/tenants/${tenant.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    ดูรายละเอียด →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {activeTenants.length === 0 ? (
          <div className="bg-white border p-10 text-center text-slate-400 rounded-2xl">ยังไม่มีผู้เช่าในขณะนี้</div>
        ) : (
          activeTenants.map((tenant) => (
            <div key={tenant.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-sm">ห้อง {tenant.room.number}</span>
                <Link href={`/tenants/${tenant.id}`} className="text-blue-600 font-bold text-sm">จัดการ →</Link>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-slate-800 text-lg">{tenant.firstName} {tenant.lastName}</p>
                <div className="flex flex-col gap-1 text-sm text-slate-500">
                  <p className="flex items-center gap-2">📞 {tenant.phone || '-'}</p>
                  <p className="flex items-center gap-2">📅 เข้าพัก: {new Date(tenant.startDate).toLocaleDateString('th-TH')}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}