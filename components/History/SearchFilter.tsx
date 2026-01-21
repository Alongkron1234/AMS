"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

const SearchFilter = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }
        router.push(`${pathname}?${params.toString()}`)

    }, 300)

    const handleMonthChange = (month: string) => {
        const params = new URLSearchParams(searchParams)
        if (month && month != "all") {
            params.set('month', month)
        } else {
            params.delete('month')
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const months = [
        { val: "1", name: "มกราคม" }, { val: "2", name: "กุมภาพันธ์" },
        { val: "3", name: "มีนาคม" }, { val: "4", name: "เมษายน" },
        { val: "5", name: "พฤษภาคม" }, { val: "6", name: "มิถุนายน" },
        { val: "7", name: "กรกฎาคม" }, { val: "8", name: "สิงหาคม" },
        { val: "9", name: "กันยายน" }, { val: "10", name: "ตุลาคม" },
        { val: "11", name: "พฤศจิกายน" }, { val: "12", name: "ธันวาคม" },
    ]
    return (
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex-1 min-w-[250px] relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                    type="text"
                    placeholder="ค้นหาเลขห้องหรือผู้เช่าห้อง"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('search')?.toString()}
                />
            </div>

            <select
                className="bg-slate-50 border-none rounded-2xl py-3 px-6 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                onChange={(e) => handleMonthChange(e.target.value)}
                value={searchParams.get('month') || "all"}
            >
                <option value="all">🗓️ ทุกเดือน</option>
                {
                    months.map(m => (
                        <option key={m.val} value={m.val}>{m.name}</option>
                    ))
                }
            </select>

            {(
                searchParams.get("search") || searchParams.get('month') && (
                    <button
                        onClick={() => router.push(pathname)}
                        className="text-xs font-bold text-red-400 hover:text-red-600 px-2"
                    >
                        ล้างการค้นหา
                    </button>
                )
            )}


        </div>
    )
}
export default SearchFilter