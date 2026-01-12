"use client"

import { useState, useEffect } from "react"
import FormContainer from "@/components/Form/FormContainer"
import { SubmitButton } from "@/components/Form/SubmitButton"
import { createInvoiceAction } from "@/actions/createInvoice"
import FormInputCal from "../Form/FormInputCal"

interface InvoiceFormProps {
    tenantId: string
    roomId: string
    roomPrice: number
    lastWater: number | null | undefined
    lastElect: number | null | undefined
    config: {
        waterUnitRate: number
        electricUnitRate: number
    }
}

export default function InvoiceForm({ tenantId, roomId, roomPrice, lastWater, lastElect, config }: InvoiceFormProps) {
    const now = new Date()
    const [billMonth, setBillMonth] = useState(now.getMonth() + 1)
    const [billYear, setBillYear] = useState(now.getFullYear())

    const initialLastWater = Number(lastWater) || 0
    const initialLastElect = Number(lastElect) || 0

    const [rent, setRent] = useState(Number(roomPrice) || 0)
    
    const [waterOld, setWaterOld] = useState<number>(initialLastWater)
    const [electOld, setElectOld] = useState<number>(initialLastElect)

    const [waterNew, setWaterNew] = useState<number>(0) 
    const [electNew, setElectNew] = useState<number>(0)
    const [other, setOther] = useState(0)

    const formatMeter = (num: number | string) => {
        return num.toString().padStart(4, '0')
    }

    const getUsage = (oldVal: number, newVal: number) => {
        const oldV = Number(oldVal) || 0;
        const newV = Number(newVal) || 0;
        if (newV === 0 || newV === oldV) return 0;
        if (newV >= oldV) return newV - oldV;
        return (10000 - oldV) + newV;
    }

    const waterUsage = getUsage(waterOld, waterNew)
    const electUsage = getUsage(electOld, electNew)
    
    const waterAmount = waterUsage * (config?.waterUnitRate || 0)
    const electAmount = electUsage * (config?.electricUnitRate || 0)
    const total = rent + waterAmount + electAmount + other

    return (
        <div className="bg-white border-2 border-blue-50 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>📝</span> ออกบิล / บันทึกมิเตอร์
            </h3>

            <FormContainer action={createInvoiceAction} redirectUrl={`/rooms/${roomId}`}>
                <input type="hidden" name="tenantId" value={tenantId} />
                <input type="hidden" name="roomId" value={roomId} />

                <div className="bg-blue-50 p-4 rounded-2xl mb-6 grid grid-cols-2 gap-4 border border-blue-100">
                    <div>
                        <label className="block text-sm font-bold text-blue-700 mb-1">ประจำเดือน</label>
                        <select 
                            name="month" value={billMonth} onChange={(e) => setBillMonth(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-blue-200 text-blue-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i+1} value={i+1}>เดือน {i+1}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-blue-700 mb-1">ปี (ค.ศ.)</label>
                        <input 
                            type="number" name="year" value={billYear} onChange={(e) => setBillYear(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-blue-200 text-blue-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ส่วนกรอกข้อมูล */}
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                            <FormInputCal
                                name="rentAmount" label="ค่าเช่าห้อง" type="number"
                                value={rent} onChange={(e) => setRent(Number(e.target.value))}
                            />
                            <FormInputCal
                                name="OtherAmount" label="ค่าบริการอื่นๆ" type="number"
                                value={other === 0 ? "" : other} onChange={(e) => setOther(Number(e.target.value))}
                            />
                        </div>

                        {/* มิเตอร์น้ำ */}
                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                            <p className="font-bold text-blue-700">💧 มิเตอร์น้ำ</p>
                            <div className="grid grid-cols-2 gap-4">
                             
                                <FormInputCal 
                                    name="waterMeterOld" 
                                    label="เลขเดิม" 
                                    type="text"   
                                    inputMode="numeric" 
                                    value={waterOld === 0 ? "" : formatMeter(waterOld)}
                                    onChange={(e) => {
                                        // กรองเอาเฉพาะตัวเลข 0-9 เท่านั้น
                                        const val = e.target.value.replace(/\D/g, ''); 
                                        setWaterOld(Number(val));
                                    }}
                                    className="bg-white border-blue-200" 
                                />
                                <FormInputCal
                                    name="waterMeterNew" label="เลขใหม่" type="number"
                                    value={waterNew === 0 ? "" : waterNew}
                                    placeholder={formatMeter(waterOld)}
                                    onChange={(e) => setWaterNew(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* มิเตอร์ไฟ */}
                        <div className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100 space-y-4">
                            <p className="font-bold text-yellow-700">⚡ มิเตอร์ไฟ</p>
                            <div className="grid grid-cols-2 gap-4">
                              

                                <FormInputCal 
                                    name="electMeterOld" 
                                    label="เลขเดิม" 
                                    type="text" 
                                    inputMode="numeric"
                                    value={electOld === 0 ? "" : formatMeter(electOld)}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, ''); 
                                        setElectOld(Number(val));
                                    }}
                                    className="bg-white border-yellow-200"
                                />
                                <FormInputCal
                                    name="electMeterNew" label="เลขใหม่" type="number"
                                    value={electNew === 0 ? "" : electNew}
                                    placeholder={formatMeter(electOld)}
                                    onChange={(e) => setElectNew(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ส่วนสรุปยอด */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white h-full flex flex-col justify-between">
                         <div>
                            <h4 className="text-slate-400 uppercase tracking-wider text-sm font-semibold mb-6">สรุปยอด ({billMonth}/{billYear})</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">ค่าเช่า</span>
                                    <span>{rent.toLocaleString()}.-</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">
                                        น้ำ <span className="text-xs text-slate-500">({formatMeter(waterOld)} → {formatMeter(waterNew)})</span>
                                    </span>
                                    <span className="text-blue-400">+{waterAmount.toLocaleString()}.-</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">
                                        ไฟ <span className="text-xs text-slate-500">({formatMeter(electOld)} → {formatMeter(electNew)})</span>
                                    </span>
                                    <span className="text-yellow-400">+{electAmount.toLocaleString()}.-</span>
                                </div>
                            </div>
                         </div>
                         
                         <div className="mt-8">
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-5xl font-extrabold text-blue-500">{total.toLocaleString()}</span>
                                <span className="text-xl">บาท</span>
                            </div>
                            <SubmitButton text="ยืนยันและออกบิล" className="w-full bg-blue-600 hover:bg-blue-700 py-4 font-bold" />
                         </div>
                    </div>
                </div>
            </FormContainer>
        </div>
    )
}