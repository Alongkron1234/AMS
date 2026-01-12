"use client"

import { useActionState } from "react"
import { useEffect } from "react"
import { toast } from "sonner" 
import { useRouter } from "next/navigation"

const initialState = {
  message: "",
  error: "",
}

interface FormContainerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any
  children: React.ReactNode
  redirectUrl?: string
}

function FormContainer({
  action,
  children,
  redirectUrl = ""
}: FormContainerProps) {
  const [state, formAction] = useActionState(action, initialState)
  const router = useRouter()

  useEffect(() => {

    if (state.error) {
      toast.error(state.error)
      return
    }

    if (state.message) {
      toast.success(state.message)

      if (redirectUrl) {
        setTimeout(() => {
           router.push(redirectUrl)
        }, 1500)
      }
    }
  }, [state, redirectUrl, router])

  return <form action={formAction}>{children}</form>
}

export default FormContainer