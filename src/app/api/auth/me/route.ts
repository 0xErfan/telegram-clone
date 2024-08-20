import connectToDB from "@/db/db";
import { RoomModel } from "@/models/Room";
import UserModel from "@/models/User";
import { tokenDecoder } from "@/utils";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {

    try {

        await connectToDB()

        const token = cookies().get('token')?.value ?? await req?.json()

        if (!token) return Response.json({ message: 'You are not logged in' }, { status: 401 })

        const verifiedToken = tokenDecoder(token) as { phone: string }

        const userData = await UserModel.findOne({ phone: verifiedToken?.phone })

        const userRooms = await RoomModel.find({
            participants: { $in: userData._id }
        }).populate({
            path: 'messages',
            populate: {
                path: 'sender',
                model: 'User',
                select: 'name'
            }
        })

        if (!userData || !verifiedToken) {
            cookies().delete('token')
            return Response.json({ message: 'No user exist with this username or password!' }, { status: 401 })
        }
        return Response.json({ ...userData, rooms: userRooms }, { status: 200 })

    } catch (err) {
        console.log(err)
        return Response.json({ message: 'Unknown error, try later.' }, { status: 500 })
    }
}