
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function InvoiceDetailPage() {
    const params = useParams()
    const [invoice, setInvoice] = useState<any>(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            const res = await fetch(`/api/invoices/${params.id}`)
            const data = await res.json()
            setInvoice(data)
        }
        fetchInvoice()
    }, [params.id])

    if (!invoice) return <div className="p-8 text-center">กำลังโหลดข้อมูลบิล...</div>

    const formatMeter = (num: number) => num.toString().padStart(4, '0')

    return (
        <section className="p-4 md:p-8 max-w-4xl mx-auto">
            {/* --- แถบควบคุม (ซ่อนอัตโนมัติเมื่อสั่งพิมพ์/เซฟ PDF) --- */}
            <div className="flex justify-between items-center mb-8 print:hidden">
                <Link href="/invoices" className="text-slate-500 hover:text-blue-600 transition text-sm">
                    ← ย้อนกลับไปรายการทั้งหมด
                </Link>
                <button 
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <span>🖨️</span> พิมพ์บิล / บันทึกเป็น PDF
                </button>
            </div>

            {/* --- ตัวใบแจ้งหนี้ (ส่วนที่จะพิมพ์ลงกระดาษ) --- */}
            <div className="bg-white border rounded-[2rem] p-10 md:p-16 shadow-sm print:border-none print:shadow-none print:p-0">
                
                {/* หัวเอกสาร */}
                <div className="flex justify-between items-start mb-16">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Invoice</h1>
                        <p className="text-slate-500 font-medium">ใบแจ้งหนี้ค่าเช่าและค่าสาธารณูปโภค</p>
                    </div>
                    <div className="text-right">
                        <div className="bg-slate-900 text-white px-6 py-2 rounded-full inline-block text-xl font-bold mb-2">
                            ห้อง {invoice.tenant.room.number}
                        </div>
                        <p className="text-slate-500">รอบเดือน {invoice.month}/{invoice.year}</p>
                    </div>
                </div>

                {/* ข้อมูลการติดต่อ */}
                <div className="grid grid-cols-2 gap-12 mb-16 py-10 border-y border-slate-100">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">ผู้เช่า (Bill To)</p>
                        <p className="text-xl font-bold text-slate-800">{invoice.tenant.firstName} {invoice.tenant.lastName}</p>
                        <p className="text-slate-500 mt-1">วันที่ออกบิล: {new Date(invoice.createdAt).toLocaleDateString('th-TH')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">สถานะ (Status)</p>
                        <p className={`text-xl font-bold ${invoice.status === 'PAID' ? 'text-green-600' : 'text-red-500'}`}>
                            {invoice.status === 'PAID' ? 'ชำระเงินแล้ว' : 'ค้างชำระ'}
                        </p>
                    </div>
                </div>

                {/* รายการค่าใช้จ่าย */}
                <table className="w-full text-left mb-16">
                    <thead>
                        <tr className="text-slate-400 text-xs uppercase border-b-2 border-slate-50">
                            <th className="pb-6 font-bold">รายการ</th>
                            <th className="pb-6 font-bold text-right">รายละเอียดมิเตอร์</th>
                            <th className="pb-6 font-bold text-right">จำนวนเงิน (บาท)</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        <tr className="border-b border-slate-50">
                            <td className="py-8 font-bold text-lg">ค่าเช่าห้องพักประจำเดือน</td>
                            <td className="py-8 text-right text-slate-400">-</td>
                            <td className="py-8 text-right font-bold text-lg">{invoice.rentAmount.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-slate-50">
                            <td className="py-8 font-bold text-lg">ค่าน้ำประปา</td>
                            <td className="py-8 text-right text-sm">
                                <span className="text-slate-400">({formatMeter(invoice.waterMeterOld)} → {formatMeter(invoice.waterMeterNew)})</span>
                                <span className="ml-2 font-bold text-slate-600">{invoice.waterUsage} หน่วย</span>
                            </td>
                            <td className="py-8 text-right font-bold text-lg">{invoice.waterAmount.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-slate-50">
                            <td className="py-8 font-bold text-lg">ค่าไฟฟ้า</td>
                            <td className="py-8 text-right text-sm">
                                <span className="text-slate-400">({formatMeter(invoice.electMeterOld)} → {formatMeter(invoice.electMeterNew)})</span>
                                <span className="ml-2 font-bold text-slate-600">{invoice.electUsage} หน่วย</span>
                            </td>
                            <td className="py-8 text-right font-bold text-lg">{invoice.electAmount.toLocaleString()}</td>
                        </tr>
                        {invoice.otherAmount > 0 && (
                            <tr className="border-b border-slate-50">
                                <td className="py-8 font-bold text-lg">ค่าบริการอื่น ๆ</td>
                                <td className="py-8 text-right text-slate-400">-</td>
                                <td className="py-8 text-right font-bold text-lg">{invoice.otherAmount.toLocaleString()}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* สรุปยอดรวม */}
                <div className="flex justify-end">
                    <div className="w-full md:w-1/2 bg-slate-900 text-white p-10 rounded-[2rem] flex justify-between items-center shadow-xl">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">รวมสุทธิทั้งสิ้น</span>
                        <div className="text-right">
                            <span className="text-4xl font-black">{invoice.totalAmount.toLocaleString()}</span>
                            <span className="ml-2 text-slate-400 uppercase font-bold text-sm">THB</span>
                        </div>
                    </div>
                </div>

                {/* ท้ายกระดาษ (สำหรับเซ็นชื่อ) */}
                <div className="mt-24 grid grid-cols-2 gap-20 text-center">
                    <div>
                        <div className="h-20 border-b border-slate-200"></div>
                        <p className="mt-4 text-xs font-bold text-slate-400 uppercase">ผู้ส่งบิล / ผู้รับเงิน</p>
                    </div>
                    <div>
                        <div className="h-20 border-b border-slate-200"></div>
                        <p className="mt-4 text-xs font-bold text-slate-400 uppercase">ผู้เช่า / ผู้รับแจ้ง</p>
                    </div>
                </div>
            </div>
        </section>
    )
}