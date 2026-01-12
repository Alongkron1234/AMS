'use server'

import prisma from "@/utils/db"
import { revalidatePath } from "next/cache"
import z, { number } from "zod"


const roomSchema = z.object({
    number: z.string().min(2, "Please Input Roomnumber"),
    price: z.coerce.number().min(0, "Price must more than 0"),
    status: z.string().default("VACANT")
})


export const createRoomActions = async(prevState: any, formData: FormData)=>{
    try{
        const rawData = Object.fromEntries(formData)
        const validatedFields = roomSchema.parse(rawData)

        const existingRoom = await prisma.room.findUnique({
            where: {number: validatedFields.number}
        })

        if(existingRoom){
            return {message: "", error: "เลขห้องนี้มีอยู่แล้ว"}
        }

        await prisma.room.create({
            data:{
                number: validatedFields.number,
                price: validatedFields.price,
                status: validatedFields.status
            }
        })
        revalidatePath("/rooms")

        return {message:"เพิ่มห้องสำเร็จ", error:""}

    }catch(error){
        console.error(error)
        return {message:"", error:"เกิดข้อผิดพลาด"}
    }

}