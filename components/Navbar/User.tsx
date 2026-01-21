import { LogIn, Settings, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton
} from "@clerk/nextjs"


const User = () => {
    return (
        <div className="flex items-center gap-4">
            {/* กรณียังไม่ได้ login */}
            <SignedOut>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">เข้าสู่ระบบ / สมัครสมาชิก</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">

                        {/* ปุ่ม Login */}
                        <SignInButton mode="modal">
                            <DropdownMenuItem className="cursor-pointer">
                                <LogIn className="mr-2 h-4 w-4" />
                                <span>เข้าสู่ระบบ</span>
                            </DropdownMenuItem>
                        </SignInButton>

                        {/* ปุ่ม Register */}
                        <SignUpButton mode="modal">
                            <DropdownMenuItem className="cursor-pointer">
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>สมัครสมาชิก</span>
                            </DropdownMenuItem>
                        </SignUpButton>

                    </DropdownMenuContent>
                </DropdownMenu>
            </SignedOut>

            {/* กรณี login แล้ว */}
            <SignedIn>
                <div className="flex items-center gap-4">
                    {/* ปุ่ม Settings */}
                    <Link href="/settings">
                        <Button variant="ghost" size="icon" title="ตั้งค่า">
                            <Settings className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                        </Button>
                    </Link>

                    {/* ปุ่ม Profile ของ Clerk (Logout อยู่ในนี้) */}
                    <UserButton afterSignOutUrl="/" />
                </div>
            </SignedIn>



            {/* <UserButton afterSignOutUrl="/sign-in" /> */}
        </div>
    )
}
export default User