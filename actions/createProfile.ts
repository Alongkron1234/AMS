"use server"

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { z, ZodError } from "zod"

const profileSchema = z.object({
    firstName: z.string().min(2, "FirstName must more than 2"),
    lastName: z.string().min(2, "lastName must more than 2"),
    userName: z.string().min(2, "userName must more than 2"),
})


const renderError = (error: unknown): { message: string, error: string } => {
    console.log(error) 
    

    if (error instanceof ZodError) {
        return { 
            message: "",
            error: error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง"
        } 
    }

    if (error instanceof Error) {
        return { 
            message: "", 
            error: error.message 
        }
    }

    return { 
        message: "", 
        error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ" 
    }
}

export const CreateProfileAction = async (prevState: any, formData: FormData) => {
    try {
        const user = await currentUser()
        if (!user) throw new Error("Please login")

        const rawData = Object.fromEntries(formData)
        const validatedFields = profileSchema.parse(rawData)

        await prisma.profile.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
                firstName: validatedFields.firstName,
                lastName: validatedFields.lastName,
                userName: validatedFields.userName
            },
        })

        const client = await clerkClient()
        await client.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true,
            },
        })

        return {message:"Create Profile Success!", error: ""}

    } catch (error) {
        // console.error(error)
        // return { message: "Failed to create profile" }
        return renderError(error)
    }
}