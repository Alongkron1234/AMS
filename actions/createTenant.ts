'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"


const tenantSchema = z.object({
    firstName: z.string().min(2, "กรุณากรอกชื่อจริง"),
    lastName: z.string().min(2, "กรุณากรอกนามสกุล"),
    idCard: z.string().optional(),
    phone: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง").optional().or(z.literal("")),
    lineId: z.string().optional(),
    deposit: z.coerce.number().optional().default(0),
    roomId: z.string().min(1, "ไม่พบรหัสห้องพัก")
})

export const createTenantAction = async (prevState: any, formData: FormData) => {
    try {
        const rawData = Object.fromEntries(formData)
        const validatedFields = tenantSchema.parse(rawData)

        await prisma.$transaction(async (tx) => {
            await tx.tenant.create({
                data: {
                    firstName: validatedFields.firstName,
                    lastName: validatedFields.lastName,
                    idCard: validatedFields.idCard || null,
                    phone: validatedFields.phone || null,
                    lineId: validatedFields.lineId || null,
                    deposit: validatedFields.deposit,
                    roomId: validatedFields.roomId,
                    startDate: new Date(),
                    isActive: true
                }
            })

            await tx.room.update({
                where: { id: validatedFields.roomId },
                data: { status: "OCCUPIED" }
            })

        })
        revalidatePath("/rooms")
        revalidatePath(`/rooms/${validatedFields.roomId}`)
        return {message:"ทำสัญญาเช่าสำเร็จ! ย้ายคนเข้าเรียบร้อย", error:""}

    } catch (error) {
        console.log(error)
        return { message: "", error: "เกิดข้อผิดพลาด" }
    }

}