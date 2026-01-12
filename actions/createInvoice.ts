
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function calculateUsage(oldVal: number, newVal: number) {

    if (newVal === 0 || newVal === oldVal) return 0;
    
    if (newVal >= oldVal) {
        return newVal - oldVal;
    } else {
        const rolloverValue = 10000;
        return (rolloverValue - oldVal) + newVal;
    }
}


function getNumber(formData: FormData, key: string): number {
    const value = formData.get(key);
    if (!value) return 0;
    const parsed = parseFloat(value.toString());
    return isNaN(parsed) ? 0 : parsed;
}

export async function createInvoiceAction(prevState: any, formData: FormData) {
    try {
        const tenantId = formData.get("tenantId") as string
        const roomId = formData.get("roomId") as string

        const month = getNumber(formData, "month")
        const year = getNumber(formData, "year")

        const rentAmount = getNumber(formData, "rentAmount")
        const waterMeterOld = getNumber(formData, "waterMeterOld")
        const waterMeterNew = getNumber(formData, "waterMeterNew")
        const electMeterOld = getNumber(formData, "electMeterOld")
        const electMeterNew = getNumber(formData, "electMeterNew")
        const otherAmount = getNumber(formData, "OtherAmount") 


        const config = await prisma.systemConfig.findFirst()
        const waterRate = config?.waterUnitRate || 18
        const electRate = config?.electricUnitRate || 7
        const waterUsage = calculateUsage(waterMeterOld, waterMeterNew)
        const electUsage = calculateUsage(electMeterOld, electMeterNew)
        
        const waterAmount = waterUsage * waterRate
        const electAmount = electUsage * electRate
        const totalAmount = rentAmount + waterAmount + electAmount + otherAmount


        const now = new Date()
        
        await prisma.invoice.create({
            data: {
                month: month,
                year: year,
                rentAmount,
                waterMeterOld,
                waterMeterNew,
                waterUsage,
                waterAmount,
                electMeterOld,
                electMeterNew,
                electUsage,
                electAmount,
                otherAmount,
                totalAmount,
                status: "UNPAID",
                tenant: {
                    connect: { id: tenantId }
                }
            }
        })


        revalidatePath(`/rooms/${roomId}`)
        revalidatePath(`/tenants/${tenantId}`)
        
        return { message: "ออกบิลสำเร็จ!", error: "" }

    } catch (error) {
        console.error("Create Invoice Error:", error)
        return { message: "", error: "เกิดข้อผิดพลาด: " + (error as Error).message }
    }
}