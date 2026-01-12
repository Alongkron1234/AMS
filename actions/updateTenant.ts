"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateTenantAction(prevState: any, formData: FormData) {
    const tenantId = formData.get("tenantId") as string
    
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const idCard = formData.get("idCard") as string
    const phone = formData.get("phone") as string
    const lineId = formData.get("lineId") as string
    const deposit = parseFloat(formData.get("deposit") as string)
    const startDate = new Date(formData.get("startDate") as string)

    try {
        const updatedTenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                firstName,
                lastName,
                idCard,
                phone,
                lineId,
                deposit,
                startDate,
            }
        })

        revalidatePath(`/tenants/${tenantId}`)
        revalidatePath(`/rooms/${updatedTenant.roomId}`)

    } catch (error) {
        return { message: "ไม่สามารถอัปเดตข้อมูลได้" }
    }

    redirect(`/tenants/${tenantId}`)
}