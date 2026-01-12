import { prisma } from "@/lib/prisma"
import FormContainer from "@/components/Form/FormContainer"
import FormInput from "@/components/Form/FormInput"
import { SubmitButton } from "@/components/Form/SubmitButton"
import { updateConfigAction } from "@/actions/updateConfigAction"


const page = async () => {
  const config = await prisma.systemConfig.findFirst()

  const defaultData = {
    waterUnitRate: config?.waterUnitRate || 18.0,
    electricUnitRate: config?.electricUnitRate || 8.0
  }

  return (
    <section className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">⚙️ ตั้งค่าระบบ</h1>
      <div className="bg-white border rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">กำหนดอัตราค่าน้ำ - ค่าไฟฟ้า</h3>

        <FormContainer action={updateConfigAction}>
          <div className="space-y-6">
            <FormInput
              name="waterUnitRate"
              label="ค่าน้ำ (บาท / หน่วย)"
              defaultValue={defaultData.waterUnitRate.toString()}
              type="number"
              required
            />

            <FormInput
              name="electricUnitRate"
              label="ค่าไฟ (บาท / หน่วย)"
              defaultValue={defaultData.electricUnitRate.toString()}
              type="number"
              required
            />

            <div className="pt-4">
              <SubmitButton text="บันทึกการตั้งค่า" className="w-full" />
            </div>

          </div>
        </FormContainer>

        <p className="mt-6 text-xs text-slate-400 text-center">
          * ค่านี้จะถูกนำไปใช้คำนวณในบิลแจ้งหนี้ใบใหม่ที่กำลังจะสร้าง
        </p>
      </div>

    </section>
  )
}
export default page