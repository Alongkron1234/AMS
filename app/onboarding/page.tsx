import FormInput from "@/components/Form/FormInput"
import { SubmitButton } from "@/components/Form/SubmitButton"
import FormContainer from "@/components/Form/FormContainer"
import { CreateProfileAction } from "@/actions/createProfile" // ⚠️ เช็คชื่อไฟล์ actions ให้ตรงนะครับ
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

async function OnboardingPage() {
  const user = await currentUser()


  if (user?.privateMetadata?.hasProfile) {
    redirect('/')
  }

  return (
    <section className="flex justify-center items-center min-h-screen p-4 bg-muted/20">
      <div className="w-full max-w-lg bg-white dark:bg-card p-8 rounded-xl shadow-lg border">
        
        <h1 className="text-2xl font-bold mb-2 text-center capitalize">
          ยินดีต้อนรับสมาชิกใหม่ 🎉
        </h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">
           กรุณากรอกข้อมูลส่วนตัวเพื่อเริ่มต้นใช้งานระบบ
        </p>

        <FormContainer action={CreateProfileAction} redirectUrl="/">
          <div className="grid gap-4">
            
            <div className="grid grid-cols-2 gap-4">
                <FormInput 
                    name="firstName" 
                    type="text" 
                    label="ชื่อจริง" 
                    placeholder="สมชาย"
                    required
                />
                <FormInput 
                    name="lastName" 
                    type="text" 
                    label="นามสกุล" 
                    placeholder="ใจดี" 
                    required
                />
            </div>

            <FormInput 
                name="userName" 
                type="text" 
                label="ชื่อผู้ใช้ (Username)" 
                placeholder="ตั้งชื่อผู้ใช้ของคุณ" 
                required
            />
          </div>

          <div className="mt-8">
            <SubmitButton text="บันทึกข้อมูล" className="w-full" size="lg" />
          </div>

        </FormContainer>

      </div>
    </section>
  )
}

export default OnboardingPage