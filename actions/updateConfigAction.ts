'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateConfigAction(prevState: any, formData: FormData) {
    try{
        const waterRate = parseFloat(formData.get("waterUnitRate") as string)
        const electRate = parseFloat(formData.get("electricUnitRate") as string)

        const config = await prisma.systemConfig.findFirst()

        if(config){
            await prisma.systemConfig.update({
                where: {id: config.id},
                data:{
                    waterUnitRate: waterRate,
                    electricUnitRate: electRate
                }
            })
        }else{
            await prisma.systemConfig.create({
                data:{
                    waterUnitRate: waterRate,
                    electricUnitRate: electRate
                }
            })
        }
        revalidatePath("/settings")
        return {message: "บันทึกการตั้งค่าสำเร็จ", error:""}
    }catch(error){
        return {message:"", error:"เกิดข้อผิดพลาดในการบันทึก"}
    }
}