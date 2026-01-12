'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function checkOutAction(roomId: string, tenantId: string) {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.room.update({
                where: { id: roomId },
                data: { status: "VACANT" }
            })

            await tx.tenant.update({
                where: { id: tenantId },
                data: {
                    isActive: false,
                    endDate: new Date()
                }
            })
        })

        revalidatePath(`/rooms/${roomId}`)
        revalidatePath("/rooms")
    } catch (error) {
        console.error(error)
        return { error: "เกิดข้อผิดพลาดในการแจ้งย้ายออก" }
    }
    redirect(`/rooms/${roomId}`)

}
