import connectToDB from "@/db/db";
import MessageModel from "@/models/Message";
import UserModel from "@/models/User";

export const POST = async (req: Request) => {

    try {
        
        await connectToDB();

        const { msgID } = await req.json()
        const { voiceData: { playedBy: playedByIds } } = await MessageModel.findOne({ _id: msgID })

        // the second part of the string after the "_" is seen time btw.
        const playedByIdsWithoutSeenTime = playedByIds.map((id: string) => id?.includes('_') ? id.split('_')[0] : id)

        const playedByUsersData = await UserModel.find({ _id: { $in: playedByIdsWithoutSeenTime } }).lean();

        const findUserSeenTimeWithID = (id: string) => {

            let seenTime = null;

            playedByIds.some((str: string) => {
                const extractedID = str?.includes('_') ? str.split('_')[0] : str
                if (extractedID === id.toString()) {
                    seenTime = str?.includes('_') ? str.split('_')[1] : null
                    return true
                }
            })

            return seenTime;

        }

        const userDataWithSeenDate = playedByUsersData.map(data => ({ ...data, seenTime: findUserSeenTimeWithID(data._id as string) }))

        return Response.json(userDataWithSeenDate, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ message: 'Unknown error, try later.', err }, { status: 500 });
    }
};