import { prisma } from "@/lib/prisma"
import FormInput from "@/components/Form/FormInput"
import { SubmitButton } from "@/components/Form/SubmitButton"
import FormContainer from "@/components/Form/FormContainer"
import { createRoomActions } from "@/actions/createRoom"
import Link from "next/link"

const Roomspage = async () => {
  // fetch
  const rooms = await prisma.room.findMany({
    orderBy: { number: 'asc' }
  })




  return (
    <section className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🏠 จัดการห้องพัก</h1>
        <div className="text-sm text-gray-500">ทั้งหมด {rooms.length} ห้อง</div>
      </div>

      <div className="bg-slate-50 border rounded-lg p-6 mb-10 shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">เพิ่มห้องใหม่</h3>

        <FormContainer action={createRoomActions}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <FormInput
              name="number"
              type="text"
              label="เลขห้อง"
              placeholder="เช่น 101"
              required
            />

            <FormInput
              name="price"
              type="number"
              label="ราคาเช่า (บาท)"
              placeholder="3500"
              required
            />
            <SubmitButton text="บันทึกห้องพัก" className="w-full" />
          </div>

        </FormContainer>




      </div>


      {
        rooms.length === 0
          ? (
            <div className="text-center py-20 text-gray-400 bg-slate-50 rounded-lg border border-dashed">
              ยังไม่มีห้องพักเลย... ลองเพิ่มห้องแรกดูสิครับ
            </div>
          )
          : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {rooms.map((room) => (
                <Link href={`/rooms/${room.id}`} key={room.id}>

                  <div key={room.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white relative group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-bold text-slate-800">{room.number}</span>
                      <span className={`text-[10px] px-2 py-1 rounded-full border ${room.status === 'VACANT' ? 'bg-green-100 text-green-700 border-green-200' :
                        room.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-orange-100 text-orange-700 border-orange-200'
                        }`}>
                        {room.status === 'VACANT' ? 'ว่าง' : 'มีคนอยู่'}

                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mb-1">ราคาเช่า</p>
                    <p className="text-xl font-semibold text-primary">
                      {room.price.toLocaleString()} <span className="text-xs text-slate-400">บ.</span>
                    </p>
                  </div>

                </Link>

              ))}

            </div>
          )
      }

    </section>
  )
}
export default Roomspage

