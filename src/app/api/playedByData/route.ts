import connectToDB from "@/db/db";
import UserModel from "@/models/User";

export const POST = async (req: Request) => {
    try {
        await connectToDB();

        const { playedByIds } = await req.json();

        const playedByUsersData = await UserModel.find({ _id: { $in: playedByIds } });

        return Response.json(playedByUsersData, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ message: 'Unknown error, try later.' }, { status: 500 });
    }
};