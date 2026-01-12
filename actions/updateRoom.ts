'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateRoomAction(prevState: any, formData: FormData) {
    try{
        const roomId = formData.get("roomId") as string
        const number = formData.get("number") as string
        const price = formData.get("price") as string

        await prisma.room.update({
            where: {id:roomId},
            data:{
                number: number,
                price: parseFloat(price)
            }
        })

        revalidatePath("/rooms")
        revalidatePath(`/rooms/${roomId}`)
        return {message: "อัปเดตข้อมูลสำเร็จ!", error:""}

    }catch(error){
        return { message: "", error: "ไม่สามารถอัปเดตได้ (เลขห้องอาจซ้ำ)" }

    }
    
}