
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { updatePaid } from "@/actions/updatePaid"


const page = async () => {
  const unpaidInvoices = await prisma.invoice.findMany({
    where: { status: "UNPAID" },
    include: {
      tenant: { include: { room: true } }
    },
    orderBy: { tenant: { room: { number: 'asc' } } }
  })

  console.log("unpain: ", unpaidInvoices)
  const totalOutstanding = unpaidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

 
  return (
    <section className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">การจัดเก็บค่าเช่า</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">รายการบิลที่รอการชำระเงินในเดือนนี้</p>
        </div>

        <div className="w-full md:w-auto bg-blue-600 text-white p-5 md:p-6 rounded-3xl shadow-lg shadow-blue-200">
          <p className="text-[10px] md:text-xs uppercase opacity-80 font-semibold tracking-wider">ยอดค้างชำระรวมทุกห้อง</p>
          <p className="text-3xl md:text-4xl font-black mt-1">
            {totalOutstanding.toLocaleString()} <span className="text-lg font-normal">บาท</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] md:min-w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-4 px-4 md:px-6 text-sm font-bold text-slate-600">ห้อง</th>
                <th className="py-4 px-4 md:px-6 text-sm font-bold text-slate-600">ผู้เช่า</th>
                <th className="py-4 px-4 md:px-6 text-sm font-bold text-slate-600 text-right">ยอดที่ต้องจ่าย</th>
                <th className="hidden sm:table-cell py-4 px-4 md:px-6 text-sm font-bold text-slate-600 text-center">สถานะ</th>
                <th className="py-4 px-4 md:px-6 text-sm font-bold text-slate-600 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {unpaidInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 md:py-5 px-4 md:px-6 font-bold text-blue-600 text-base md:text-lg">
                    {inv.tenant.room.number}
                  </td>
                  <td className="py-4 md:py-5 px-4 md:px-6">
                    <p className="font-semibold text-slate-800 text-sm md:text-base line-clamp-1">
                      {inv.tenant.firstName}
                    </p>
                    <p className="text-[10px] md:text-xs text-slate-400">{inv.month}/{inv.year}</p>
                  </td>
                  <td className="py-4 md:py-5 px-4 md:px-6 text-right font-bold text-slate-800 text-sm md:text-base">
                    {inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="hidden sm:table-cell py-4 md:py-5 px-4 md:px-6 text-center">
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-[10px] font-bold border border-red-100 whitespace-nowrap">
                      ยังไม่จ่าย
                    </span>
                  </td>
                  <td className="py-4 md:py-5 px-4 md:px-6 text-right">
                    <div className="flex justify-end gap-1 md:gap-2">
                      <Link href={`/invoices/${inv.id}`}>
                        <button className="text-slate-500 hover:text-blue-600 text-xs font-medium px-2 py-1">
                          บิล
                        </button>
                      </Link>
                      <form action={async (formData) =>{
                        "use server";
                        await updatePaid(formData)
                      }}>
                        <input type="hidden" name="invoiceId" value={inv.id} />
                        <button className="bg-green-600 text-white px-2 md:px-4 py-1.5 rounded-lg text-[10px] md:text-sm font-bold whitespace-nowrap">
                          รับชำระ
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
export default page