import { LayoutDashboard, Home, Receipt, Users, Settings, History, HistoryIcon } from "lucide-react"

export const getNavLinks = (pathname: string) => [
  {
    href: "/",
    label: "ภาพรวม",
    icon: LayoutDashboard,
    active: pathname === "/",
  },
  {
    href: "/rooms",
    label: "ผังห้องพัก",
    icon: Home,
    active: pathname.startsWith("/rooms"),
  },
  {
    href: "/invoices",
    label: "บัญชี & การเงิน",
    icon: Receipt,
    active: pathname.startsWith("/invoices"),
  },
  {
    href: "/tenants",
    label: "ผู้เช่า",
    icon: Users,
    active: pathname.startsWith("/tenants"),
  },
  {
    href: "/historybill",
    label: "ประวัติการชำระเงิน",
    icon: HistoryIcon,
    active: pathname.startsWith("/historybill"),
  },
]