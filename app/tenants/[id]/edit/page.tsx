import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import TenantForm from "@/components/Tenant/TenantForm"
import Link from "next/link"

export default async function EditTenantPage({ params }: { params: { id: string } }) {
    const { id } = await params

    const tenant = await prisma.tenant.findUnique({
        where: { id },
    })

    if (!tenant) return notFound()

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-slate-800">📝 แก้ไขข้อมูลผู้เช่า</h1>
            <Link href={`/tenants/${tenant.id}`} className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block">
                ← ย้อนกลับไปหน้ารายละเอียด
            </Link>
            <TenantForm type="edit" initialData={tenant} roomId={tenant.roomId} />
        </div>
    )
}