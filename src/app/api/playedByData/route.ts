import connectToDB from "@/db/db";
import UserModel from "@/models/User";

export const POST = async (req: Request) => {
    try {
        await connectToDB();

        const { playedByIds } = await req.json();

        // the second part of the string after the "_" is seen time btw.
        const playedByIdsWithoutSeenTime = playedByIds.map(id => id?.includes('_') ? id.split('_')[0] : id)

        const playedByUsersData = await UserModel.find({ _id: { $in: playedByIdsWithoutSeenTime } });
        console.log(playedByUsersData)

        return Response.json(playedByUsersData, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ message: 'Unknown error, try later.', err }, { status: 500 });
    }
};