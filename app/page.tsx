import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image";

export default async function Home() {
  const user = await currentUser()

  if (!user) {
    return (
      // <div className="flex items-center justify-center min-h-screen">
      //   <p className="text-lg font-semibold text-slate-600">Please Sign In to continue</p>
      // </div>
      <main className="w-full">

        {/* 2. ลบ rounded-3xl ออกเพื่อให้ขอบรูปชนขอบจอ */}
    <section className="relative w-full h-screen overflow-hidden">
  <Image
    src="/myAMS.jpg" 
    alt="AMS Dormitory Hero Image"
    fill
    priority
    className="object-cover" 
  />
  
  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
    <h1 className="text-4xl md:text-7xl font-black text-white text-center drop-shadow-2xl">
      ยินดีต้อนรับสู่ <br />
      <span className="text-orange-400">My AMS</span>
    </h1>
  </div>
</section>

      </main>
    )
  }

  if (!user.privateMetadata?.hasProfile) {
    redirect("/onboarding")
  }

  const [rooms, invoices] = await Promise.all([
    prisma.room.findMany({
      orderBy: { number: 'asc' }
    }),
    prisma.invoice.findMany({
      where: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      },
      include: {
        tenant: {
          include: {
            room: true
          }
        }
      }
    })
  ])

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const paidAmount = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.totalAmount, 0)
  const vacantRooms = rooms.filter(r => r.status === 'VACANT').length

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ภาพรวมหอพักประจำเดือน</h1>
        <p className="text-slate-500 font-medium">
          ข้อมูลสรุป ณ วันที่ {new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
        </p>
      </header>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-100">
          <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">ยอดเรียกเก็บทั้งหมด</p>
          <h2 className="text-4xl font-black">{totalRevenue.toLocaleString()} <span className="text-lg">฿</span></h2>
        </div>
        <div className="bg-emerald-500 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-100">
          <p className="text-emerald-50 text-sm font-bold uppercase tracking-wider mb-1">ยอดที่ชำระแล้ว</p>
          <h2 className="text-4xl font-black">{paidAmount.toLocaleString()} <span className="text-lg">฿</span></h2>
        </div>
        <div className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] shadow-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">ห้องว่างขณะนี้</p>
          <h2 className="text-4xl font-black text-slate-800">{vacantRooms} <span className="text-lg text-slate-400">ห้อง</span></h2>
        </div>
      </div>


      <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          🏠 ผังสถานะห้องพักทั้งหมด
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {rooms.map((room) => (
            <Link key={room.id} href={`/rooms/${room.id}`}>
              <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all hover:scale-105 active:scale-95 cursor-pointer
                ${room.status === 'VACANT'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  : 'bg-slate-900 border-slate-900 text-white'}`}
              >
                <span className="text-xs font-bold uppercase opacity-60">ห้อง</span>
                <span className="text-xl font-black">{room.number}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex gap-6 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> ห้องว่าง
          </div>
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-3 h-3 bg-slate-900 rounded-full"></div> มีผู้เช่า
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6">📢 บิลที่ยังค้างชำระ</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-4 py-2">ห้อง</th>
                <th className="px-4 py-2">ผู้เช่า</th>
                <th className="px-4 py-2 text-right">ยอดค้าง</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .filter(inv => inv.status === 'UNPAID')
                .map((inv) => (
                  <tr key={inv.id} className="bg-slate-50 hover:bg-slate-100 transition-colors">
                    {/* ข้อมูลจะหายแดงเพราะเรา include tenant และ room มาแล้ว */}
                    <td className="px-4 py-4 rounded-l-2xl font-black text-slate-700">
                      {inv.tenant?.room?.number || '-'}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-600">
                      {inv.tenant?.firstName || 'Unknown'}
                    </td>
                    <td className="px-4 py-4 text-right font-black text-red-500">
                      {inv.totalAmount.toLocaleString()}.-
                    </td>
                    <td className="px-4 py-4 rounded-r-2xl text-right">
                      <Link href={`/invoices/${inv.id}`} className="text-xs bg-white border px-3 py-1.5 rounded-lg font-bold hover:shadow-md transition">
                        ดูบิล
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {invoices.filter(inv => inv.status === 'UNPAID').length === 0 && (
            <p className="text-center text-slate-400 py-4">ไม่มีบิลค้างชำระในเดือนนี้</p>
          )}
        </div>
      </div>
    </div>
  );
}