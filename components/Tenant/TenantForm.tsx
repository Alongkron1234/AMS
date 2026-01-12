"use client"

import FormContainer from "@/components/Form/FormContainer"
import FormInput from "@/components/Form/FormInput"
import { SubmitButton } from "@/components/Form/SubmitButton"
import { createTenantAction } from "@/actions/createTenant"
import { updateTenantAction } from "@/actions/updateTenant" 


interface TenantData {
    id: string;
    firstName: string;
    lastName: string;
    idCard?: string | null;
    phone?: string | null;
    lineId?: string | null;
    deposit: number;
    startDate: Date | string;
}


interface TenantFormProps {
    roomId: string
    type: "create" | "edit"
    initialData?: TenantData 
}

export default function TenantForm({ roomId, type, initialData }: TenantFormProps) {
    // เลือก Action ตามประเภทของฟอร์ม
    const action = type === "create" ? createTenantAction : updateTenantAction

    return (
        <FormContainer action={action} redirectUrl={`/rooms/${roomId}`}>
            {/* Hidden Fields */}
            <input type="hidden" name="roomId" value={roomId} />
            {type === "edit" && <input type="hidden" name="tenantId" value={initialData?.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                
                <div className="md:col-span-2 border-b pb-2">
                    <h3 className="font-bold text-slate-700">👤 ข้อมูลส่วนตัว</h3>
                </div>

                <FormInput 
                    name="firstName" 
                    label="ชื่อ" 
                    type="text" 
                    defaultValue={initialData?.firstName} 
                    required 
                />
                <FormInput 
                    name="lastName" 
                    label="นามสกุล" 
                    type="text" 
                    defaultValue={initialData?.lastName} 
                    required 
                />
                <FormInput 
                    name="idCard" 
                    label="เลขบัตรประชาชน" 
                    type="text" 
                    defaultValue={initialData?.idCard?.toString()} 
                />
                <FormInput 
                    name="phone" 
                    label="เบอร์โทรศัพท์" 
                    type="tel" 
                    defaultValue={initialData?.phone?.toString()} 
                    required 
                />
                <FormInput 
                    name="lineId" 
                    label="Line ID" 
                    type="text" 
                    defaultValue={initialData?.lineId?.toString()} 
                />

                <div className="md:col-span-2 border-b pb-2 mt-4">
                    <h3 className="font-bold text-slate-700">📄 รายละเอียดสัญญา</h3>
                </div>

                <FormInput 
                    name="deposit" 
                    label="เงินมัดจำ (บาท)" 
                    type="number" 
                    defaultValue={initialData?.deposit?.toString()} 
                    required 
                />
                <FormInput 
                    name="startDate" 
                    label="วันที่เริ่มเช่า" 
                    type="date" 
                    defaultValue={initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : ""} 
                    required 
                />

                <div className="md:col-span-2 mt-4">
                    <SubmitButton 
                        text={type === "create" ? "ลงทะเบียนผู้เช่า" : "บันทึกการแก้ไข"} 
                        className="w-full py-4 text-lg"
                    />
                </div>
            </div>
        </FormContainer>
    )
}