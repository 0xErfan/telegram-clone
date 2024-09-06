import connectToDB from "@/db/db";
import RoomModel from "@/models/Room";
import UserModel from "@/models/User";

export const POST = async (req: Request) => {

    try {
        await connectToDB()
        const { query } = await req.json()

        let result;

        result = await RoomModel.findOne({ link: query })
        if (!result) result = await UserModel.findOne({ username: query })

        if (result) return Response.json(result, { status: 200 })
        return Response.json(null, { status: 404 })

    } catch (err) {
        console.log(err)
        return Response.json({ message: 'Unknown error, try later.' }, { status: 500 })
    }
}