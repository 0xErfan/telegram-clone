import connectToDB from "@/config/db"

export default async function Home() {

  await connectToDB()

  return (
    <div className="text-2xl flex-center">Hi there</div>
  )
}
