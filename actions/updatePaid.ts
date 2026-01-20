'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updatePaid(formData: FormData) {
    try{
        const invoiceId = formData.get("invoiceId") as string

        await prisma.invoice.update({
            where: {id: invoiceId},
            data:{status: "PAID"}
        })

        revalidatePath("/invoices")
        return {message: "อัปเดตข้อมูลสำเร็จ!", error:""}

    }catch(error){
        return { message: "", error: "ไม่สามารถอัปเดตได้ (เลขห้องอาจซ้ำ)" }

    }
    
}