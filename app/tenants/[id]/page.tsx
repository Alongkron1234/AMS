import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
)

const TenantDetailPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params
    const tenant = await prisma.tenant.findUnique({
        where: { id },
        include: {
            room: true,
            invoices: true
        }
    })

    if (!tenant) return notFound()
    return (
        <section className="p-8 max-w-5xl mx-auto">
            <Link href={`/rooms/${tenant.roomId}`} className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block">
                ← ย้อนกลับไปหน้าห้อง
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* left: ข้อมูลส่วนตัว */}
                <div className="md:col-span-1 space-y-6">

                    <div className="bg-white border rounded-2xl p-6 shadow-sm text-center relative group">
                        <Link
                            href={`/tenants/${tenant.id}/edit`}
                            className="absolute top-3 right-3 text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all"
                            title="แก้ไขข้อมูลส่วนตัว"
                        >
                            <PencilIcon />
                        </Link>
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                            {tenant.firstName.charAt(0)}
                        </div>

                        <h1 className="text-2xl font-bold text-slate-800">{tenant.firstName} {tenant.lastName}</h1>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${tenant.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {tenant.isActive ? 'กำลังพักอาศัย' : 'ย้ายออกแล้ว'}
                        </span>
                    </div>

                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 border-b pb-2">ข้อมูลการติดต่อ</h3>
                        <div className="space-y-3 text-sm">
                            <p><span className="text-slate-500">เบอร์โทร:</span>{tenant.phone}</p>
                            <p><span className="text-slate-500">Line ID:</span>{tenant.lineId}</p>
                            <p><span className="text-slate-500">เลขบัตร:</span>{tenant.idCard}</p>
                        </div>
                    </div>
                </div>


                {/* right: รายละเอียดเงิน */}
                <div className="md:col-span-2 space-y-6">
                    {/* สัญญา */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold mb-4">รายละเอียดสัญญา</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-xs text-slate-500">ห้องพัก</p>
                                <p className="font-bold text-lg">ห้อง {tenant.room.number}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-xs text-slate-500">เงินมัดจำ</p>
                                <p className="font-bold text-lg text-blue-600">{tenant.deposit.toLocaleString()} บาท</p>
                            </div>
                            <div className="p-2">
                                <p className="text-xs-slate-500">วันที่ย้ายเข้า</p>
                                <p className="font-medium">{new Date(tenant.startDate).toLocaleDateString('th-TH')}</p>

                            </div>
                            <div className="p-2">
                                <p className="text-xs-slate-500">วันที่ย้ายออก</p>
                                <p className="font-meduim">{tenant.endDate ? new Date(tenant.endDate).toLocaleDateString('th-TH') : '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* รายการบิล */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">ประวัติการชำระเงิน</h3>
                            <Link href={`/rooms/${tenant.roomId}`}>
                                <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
                                    + สร้างบิลใหม่
                                </button>
                            </Link>

                        </div>

                        {
                            tenant.invoices.length === 0
                                ? (
                                    <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-xl">
                                        ยังไม่มีรายการบิล
                                    </div>
                                )
                                : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="text-xs text-slate-500 uppercase border-b">
                                                <tr>
                                                    <th className="py-3 px-2">รอบเดือน</th>
                                                    <th className="py-3 px-2">ยอดรวม</th>
                                                    <th className="py-3 px-2">สถานะ</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm divide-y divide-slate-50">
                                                {tenant.invoices.map((inv) => (
                                                    <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                                                        <td className="py-3 px-4">{inv.month}/{inv.year}</td>
                                                        <td className="py-3 px-4 text-right font-medium">{inv.totalAmount.toLocaleString()}</td>
                                                        <td className="py-3 px-4 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'PAID'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {inv.status === 'PAID' ? 'จ่ายแล้ว' : 'ค้างจ่าย'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}




                                            </tbody>
                                        </table>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}
export default TenantDetailPage