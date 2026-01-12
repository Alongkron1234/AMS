// มานั้งเขียนใหม่
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: { tenant: { include: { room: true } } }
    })
    return NextResponse.json(invoice)
}