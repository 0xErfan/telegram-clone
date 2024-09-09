import type { RoomModel as RoomModelType, UserModel as UserModelType } from "@/@types/data.t";
import connectToDB from "@/db/db";
import MessageModel from "@/models/Message";
import RoomModel from "@/models/Room";
import UserModel from "@/models/User";

export const POST = async (req: Request) => {

    try {
        await connectToDB()
        const { query } = await req.json()
        const { userID, payload: purePayload } = query

        const payload = purePayload.toLowerCase()

        let result;
        ''.toLowerCase
        if (payload.startsWith('@')) {
            result = await RoomModel.findOne({ link: payload })
            if (!result) result = await UserModel.findOne({ username: payload })

            if (result) return Response.json([result], { status: 200 })
            return Response.json(null, { status: 404 })
        }

        const userRoomsData: RoomModelType[] = await RoomModel
            .find({ participants: { $in: userID } })
            .populate('messages', '', MessageModel)
            .populate('participants')
            .lean();

        const searchResult: (RoomModelType & { findBy: keyof RoomModelType })[] = []

        userRoomsData.forEach(roomData => {

            if (roomData.type !== 'private' && roomData.name.toLowerCase().includes(payload)) searchResult.push({ ...roomData, findBy: 'name' })

            if (roomData.type == 'private' && roomData.participants.some((data: any) => data._id !== userID && data.name.toLowerCase().includes(payload))) {
                searchResult.push({
                    ...roomData,
                    findBy: 'participants',
                    name: roomData.participants.find((data: any) => data._id == roomData.creator)?.name
                })
            }

            roomData.messages.forEach(msgData => {
                if (msgData.message.toLowerCase().includes(payload)) {
                    searchResult.push({
                        ...roomData,
                        findBy: 'messages',
                        name: roomData.type == 'private' ? roomData.participants.find((data: any) => data._id == roomData.creator)?.name ?? "" : roomData.name
                    })
                }
            })

        })

        return Response.json(searchResult, { status: 200 })

    } catch (err) {
        console.log(err)
        return Response.json({ message: 'Unknown error, try later.' }, { status: 500 })
    }
}