// import { prisma } from "@/lib/prisma"
// import Link from "next/link"
// import FormContainer from "@/components/Form/FormContainer"
// import FormInput from "@/components/Form/FormInput"
// import { SubmitButton } from "@/components/Form/SubmitButton"
// import { updateRoomAction } from "@/actions/updateRoom" // อย่าลืม import action ตัวใหม่
// import { checkOutAction } from "@/actions/checkOutAction"

// const RoomDetailPage = async ({ params }: { params: { id: string } }) => {
//     const { id } = await params

//     const room = await prisma.room.findUnique({
//         where: { id },
//         include: {
//             tenants: {
//                 where: { isActive: true }
//             }
//         }
//     })

//     if (!room) return <div>ไม่พบข้อมูลห้องพัก</div>

//     const currentTenant = room.tenants[0]

//     return (
//         <section className="p-8 max-w-4xl mx-auto">
//             <Link href="/rooms" className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block transition">
//                 ← ย้อนกลับไปหน้ารายการ
//             </Link>

//             <div className="space-y-6">
//                 {/* ส่วนแสดงข้อมูลหลัก */}
//                 <div className="bg-white border rounded-2xl p-8 shadow-sm">
//                     <div className="flex justify-between items-start mb-6">
//                         <div>
//                             <h1 className="text-4xl font-bold text-slate-800">ห้อง {room.number}</h1>
//                             <p className="text-slate-500 mt-2 text-lg">
//                                 ราคาเช่าปัจจุบัน: <span className="font-semibold text-slate-800">{room.price.toLocaleString()}</span> บาท/เดือน
//                             </p>
//                         </div>

//                         <span className={`px-4 py-2 rounded-full text-sm font-medium border ${room.status === 'VACANT'
//                             ? 'bg-green-100 text-green-700 border-green-200'
//                             : 'bg-blue-100 text-blue-700 border-blue-200'
//                             }`}>
//                             {room.status === 'VACANT' ? 'สถานะ: ว่าง' : 'สถานะ: มีคนอยู่'}
//                         </span>
//                     </div>

//                     <hr className="border-slate-100 my-8" />

//                     {/* การจัดการสถานะผู้เช่า */}
//                     <div>
//                         <h2 className="text-xl font-semibold text-slate-800 mb-4">การจัดการผู้เช่า</h2>
//                         {room.status === 'VACANT'
//                             ? (
//                                 <div className="bg-green-50/50 border border-green-100 rounded-xl p-6 text-center">
//                                     <p className="text-green-800 mb-4 font-medium">ห้องนี้พร้อมปล่อยเช่า</p>
//                                     <Link href={`/tenants/create?roomId=${room.id}`}>
//                                         <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-sm transition font-medium">
//                                             + ทำสัญญาเช่า / ย้ายคนเข้า
//                                         </button>
//                                     </Link>
//                                 </div>
//                             )
//                             : (
//                                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
//                                     <div className="flex items-center gap-4 mb-4">
//                                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
//                                             {currentTenant?.firstName?.charAt(0) || '?'}
//                                         </div>
//                                         <div>
//                                             <p className="text-sm text-slate-500">ผู้เช่าปัจจุบัน</p>
//                                             <p className="text-lg font-bold text-slate-800">
//                                                 {currentTenant?.firstName} {currentTenant?.lastName}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-4 mt-6">
//                                         <Link href={`/tenants/${currentTenant.id}`}>
//                                             <button className="w-full bg-white border hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg transition text-sm font-medium">
//                                                 ดูรายละเอียดผู้เช่า
//                                             </button>
//                                         </Link>


//                                         <form action={async () => {
//                                             'use server'
//                                             if (currentTenant) {
//                                                 await checkOutAction(room.id, currentTenant.id)
//                                             }
//                                         }}>
//                                             <button className="w-full bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 py-2.5 rounded-lg transition text-sm font-medium">
//                                                 แจ้งย้ายออก (Check-out)
//                                             </button>
//                                         </form>

//                                     </div>

//                                 </div>
//                             )
//                         }
//                     </div>
//                 </div>

//                 {/* --- ส่วนแก้ไขข้อมูลห้อง (Edit Form) --- */}
//                 <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8">
//                     <h3 className="text-lg font-bold text-slate-800 mb-4">⚙️ แก้ไขราคาหรือเลขห้อง</h3>
//                     <FormContainer action={updateRoomAction} redirectUrl="/rooms">
//                         <input type="hidden" name="roomId" value={room.id} />
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
//                             <FormInput
//                                 name="number"
//                                 label="หมายเลขห้อง"
//                                 defaultValue={room.number}
//                                 type="text"
//                                 required
//                             />
//                             <FormInput
//                                 name="price"
//                                 label="ราคาเช่าใหม่ (บาท)"
//                                 defaultValue={room.price.toString()}
//                                 type="number"
//                                 required
//                             />
//                         </div>
//                         <div className="mt-6 flex justify-end">
//                             <SubmitButton text="บันทึกการเปลี่ยนแปลง" className="w-full md:w-auto px-10" />
//                         </div>
//                     </FormContainer>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default RoomDetailPage

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import FormContainer from "@/components/Form/FormContainer"
import FormInput from "@/components/Form/FormInput"
import { SubmitButton } from "@/components/Form/SubmitButton"
import { updateRoomAction } from "@/actions/updateRoom"
import { checkOutAction } from "@/actions/checkOutAction"
import { createInvoiceAction } from "@/actions/createInvoice"
import InvoiceForm from "@/components/Invoice/InvoiceForm"

const RoomDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const room = await prisma.room.findUnique({
        where: { id },
        include: {
            tenants: {
                where: { isActive: true }
            }
        }
    })

    if (!room) return <div className="p-8 text-center">ไม่พบข้อมูลห้องพัก</div>

    const currentTenant = room.tenants[0]

    const lastInvoice = currentTenant ? await prisma.invoice.findFirst({
        where: { tenantId: currentTenant.id },
        orderBy: [
            {year: 'desc'},
            {month: 'desc'}
        ]
    }) : null

    const config = await prisma.systemConfig.findFirst() || { waterUnitRate: 18, electricUnitRate: 7 }

    return (
        <section className="p-8 max-w-4xl mx-auto">
            <Link href="/rooms" className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block transition">
                ← ย้อนกลับไปหน้ารายการ
            </Link>

            <div className="space-y-6">
                <div className="bg-white border rounded-2xl p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">ห้อง {room.number}</h1>
                            <p className="text-slate-500 mt-2 text-lg">
                                ราคาเช่าปัจจุบัน: <span className="font-semibold text-slate-800">{room.price.toLocaleString()}</span> บาท/เดือน
                            </p>
                        </div>

                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${room.status === 'VACANT'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-blue-100 text-blue-700 border-blue-200'
                            }`}>
                            {room.status === 'VACANT' ? 'สถานะ: ว่าง' : 'สถานะ: มีคนอยู่'}
                        </span>
                    </div>

                    <hr className="border-slate-100 my-8" />

                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">การจัดการผู้เช่า</h2>
                        {room.status === 'VACANT'
                            ? (
                                <div className="bg-green-50/50 border border-green-100 rounded-xl p-6 text-center">
                                    <p className="text-green-800 mb-4 font-medium">ห้องนี้พร้อมปล่อยเช่า</p>
                                    <Link href={`/tenants/create?roomId=${room.id}`}>
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-sm transition font-medium">
                                            + ทำสัญญาเช่า / ย้ายคนเข้า
                                        </button>
                                    </Link>
                                </div>
                            )
                            : (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                            {currentTenant?.firstName?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">ผู้เช่าปัจจุบัน</p>
                                            <p className="text-lg font-bold text-slate-800">
                                                {currentTenant?.firstName} {currentTenant?.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <Link href={`/tenants/${currentTenant.id}`} className="w-full">
                                            <button className="w-full bg-white border hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg transition text-sm font-medium">
                                                ดูรายละเอียดผู้เช่า
                                            </button>
                                        </Link>

                                        <form action={async () => {
                                            'use server'
                                            if (currentTenant) {
                                                await checkOutAction(room.id, currentTenant.id)
                                            }
                                        }}>
                                            <button className="w-full bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 py-2.5 rounded-lg transition text-sm font-medium">
                                                แจ้งย้ายออก (Check-out)
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                {currentTenant && (
                    <InvoiceForm
                        tenantId={currentTenant.id}
                        roomId={room.id}
                        roomPrice={room.price}
                        lastWater={lastInvoice?.waterMeterNew || 0}
                        lastElect={lastInvoice?.electMeterNew || 0}
                        config={config}
                    />
                )}


                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">⚙️ แก้ไขราคาหรือเลขห้องพื้นฐาน</h3>
                    <FormContainer action={updateRoomAction} redirectUrl="/rooms">
                        <input type="hidden" name="roomId" value={room.id} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <FormInput name="number" label="หมายเลขห้อง" defaultValue={room.number} type="text" required />
                            <FormInput name="price" label="ราคาเช่าปกติ (บาท)" defaultValue={room.price.toString()} type="number" required />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <SubmitButton text="บันทึกการเปลี่ยนแปลง" className="w-full md:w-auto px-10" />
                        </div>
                    </FormContainer>
                </div>
            </div>
        </section>
    )
}

export default RoomDetailPage