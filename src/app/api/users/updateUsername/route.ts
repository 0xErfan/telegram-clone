import type { RoomModel as RoomModelType, UserModel as UserModelType } from "@/@types/data.t";
import connectToDB from "@/db/db";
import MessageModel from "@/models/Message";
import RoomModel from "@/models/Room";
import UserModel from "@/models/User";

export const POST = async (req: Request) => {

    try {
        await connectToDB()
        const { query } = await req.json()

        const trimmedQuery = query.toLowerCase()

        const isQueryValidAndAvailable = trimmedQuery.length > 3 && trimmedQuery.length <= 21
        if (!isQueryValidAndAvailable) return Response.json({ isValid: false }, { status: 403 })

        const isUsernameExist = await UserModel.findOne({ username: query })

        return Response.json({ isValid: !isUsernameExist, message: isUsernameExist ? 'This username already taken btw.' : null }, { status: isUsernameExist ? 403 : 200 })

    } catch (err) {
        console.log(err)
        return Response.json({ message: 'Unknown error, try later.' }, { status: 500 })
    }
}