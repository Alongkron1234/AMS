"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { getNavLinks } from "@/utils/links"
import User from "./User"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle, 
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const routes = getNavLinks(pathname)

  return (
    <nav className="border-b bg-white dark:bg-black shadow-sm sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
        
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px]">
                <SheetHeader className="text-left mb-4">
                  <SheetTitle className="text-blue-600 font-bold">SmartDorm</SheetTitle>
                  <SheetDescription>เมนูการใช้งาน</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`flex items-center gap-2 text-lg transition-colors hover:text-blue-600 ${
                        route.active ? "text-blue-600 font-bold" : "text-gray-500"
                      }`}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <span>🏢 SmartDorm</span>
          </Link>
        </div>

        {/* Menu (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-2 transition-colors hover:text-blue-600 ${
                route.active ? "text-black dark:text-white font-bold" : "text-gray-500"
              }`}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>

        <User />
      </div>
    </nav>
  )
}