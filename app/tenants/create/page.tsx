import { prisma } from "@/lib/prisma";
import FormContainer from "@/components/Form/FormContainer";
import FormInput from "@/components/Form/FormInput";
import { SubmitButton } from "@/components/Form/SubmitButton";
import { createTenantAction } from "@/actions/createTenant";
import Link from "next/link";
import TenantForm from "@/components/Tenant/TenantForm";

interface CreateTenantPageProps {
    searchParams: Promise<{ roomId: string }>
}

export default async function CreateTenantPage({ searchParams }: CreateTenantPageProps) {
    const { roomId } = await searchParams

    const room = await prisma.room.findUnique({
        where: { id: roomId }
    })

    if (!room) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl text-red-500">ไม่พบข้อมูลห้องพักที่ระบุ</h1>
                <Link href="/rooms" className="text-blue-500 underline">กลับไปหน้ารวมห้อง</Link>
            </div>
        )
    }

    return (
        <section className="p-8 max-w-2xl mx-auto">
            <Link href={`/rooms/${roomId}`} className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block transition">
                ← ยกเลิกและย้อนกลับ
            </Link>

            <div className="bg-white border rounded-2xl p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">✍️ ทำสัญญาเช่า / ย้ายเข้า</h1>
                <p className="text-slate-500 mb-8">
                    ทำรายการสำหรับห้อง: <span className="font-bold text-blue-600 text-lg">{room.number}</span>
                </p>

                {/* <FormContainer action={createTenantAction} redirectUrl={`/rooms/${roomId}`}>

                    <input type="hidden" name="roomId" value={roomId} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="firstName" label="ชื่อจริง" placeholder="สมชาย" type="text" required/>
                        <FormInput name="lastName" label="นามสกุล" placeholder="ใจดี" type="text" required/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormInput name="phone" label="เบอร์โทรศัพท์ (ถ้ามี)" placeholder="08x-xxx-xxxx" type="text" />
                        <FormInput name="lineId" label="Line ID (ถ้ามี)" placeholder="ไอดีไลน์" type="text" />
                    </div>

                    <div className="mt-4 space-y-4">
                        <FormInput name="idCard" label="เลขบัตรประชาชน" placeholder="1-xxxx-xxxx-xx-xx" type="text" />

                        <FormInput
                            name="deposit"
                            label="เงินประกัน / มัดจำ (บาท)"
                            placeholder="0"
                            defaultValue="0"
                            type="number"
                        />
                    </div>

                    <div className="mt-10">
                        <SubmitButton text="ยืนยันสัญญาและย้ายเข้า" className="w-full py-3 text-lg" />
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        * เมื่อบันทึกแล้ว สถานะห้องจะเปลี่ยนเป็น "มีคนอยู่" โดยอัตโนมัติ
                    </p>
                </FormContainer> */}
                <TenantForm
                    type="create"
                    roomId={roomId}
                />
            </div>





            {/* <div>เจอห้อง {room.number} แล้ว เตรียมทำสัญญาเช่า</div> */}
        </section>
    )
}