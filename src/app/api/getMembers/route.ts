import connectToDB from "@/db/db";
import RoomModel from "@/models/Room";

export const POST = async (req: Request) => {

    try {
        await connectToDB()

        const { _id } = await req.json()
        const roomMembers = await RoomModel.findOne({ _id }).populate('participants')

        return Response.json(roomMembers.participants, { status: 200 })

    } catch (err) {
        console.log(err)
        return Response.json({ message: 'Unknown error, try later.' }, { status: 500 })
    }
}