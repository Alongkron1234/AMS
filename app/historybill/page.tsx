import HistoryStats from "@/components/History/HistorySate"
import HistoryTable from "@/components/History/HistoryTable"
import SearchFilter from "@/components/History/SearchFilter"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface Props {
    searchParams: Promise<{
        search?: string
        month?: string
    }>
}

// { search: "101", month: "5"}  get ตามรอบเดือนบิล
const historybillPage = async ({searchParams}: Props) => {

    const {search, month} = await searchParams

    const whereCondition: any = {
        status: "PAID"
    }

    if(month && month !== "all"){
        whereCondition.month = parseInt(month)
    }

    if(search){
        whereCondition.OR = [
            { tenant: { firstName: { contains: search, mode: 'insensitive' } } },
            { tenant: { room: { number: { contains: search, mode: 'insensitive' } } } }
        ]
    }

    const paidInvoices = await prisma.invoice.findMany({
        where: whereCondition,
        include: {
            tenant: {
                include: {
                    room: true
                }
            }
        },
        orderBy: {
            paidAt: 'desc'
        }
    })

    const totalCollected = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

    return (
        <section className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* 1. ส่วนหัวและสถิติ */}
            <HistoryStats total={totalCollected} />

            {/* 2. ส่วนค้นหา (Client Component) */}
            <SearchFilter />

            {/* 3. ส่วนตารางแสดงข้อมูล */}
            <HistoryTable invoices={paidInvoices} />
        </section>
    )
}
export default historybillPage