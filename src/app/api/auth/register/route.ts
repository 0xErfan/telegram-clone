import connectToDB from "@/db/db";
import RoomModel from "@/models/Room";
import UserModel from "@/models/User";
import { tokenGenerator } from "@/utils";
import { hash } from "bcrypt";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {

    try {

        await connectToDB()

        const { username, phone, password: purePass } = await req.json()

        const password = await hash(purePass, 12)

        const userData = await UserModel.create({
            name: username?.replace('@', ''),
            lastName: '',
            username,
            password,
            phone: phone.toString(),
        })

        await RoomModel.create({
            name: 'Saved Messages',
            avatar: '/images/savedMessages.png',
            type: 'private',
            creator: userData._id,
            participants: [userData._id]
        })

        const token = tokenGenerator(userData.phone, 7)

        cookies().set('token', token, { httpOnly: true, maxAge: 60 * 60 * 14 })
        return Response.json(userData, { status: 201 })

    } catch (err: any) {
        console.log(err)
        const existedUsernameOrPhone = Object.keys(err.errorResponse?.keyPattern).join('')

        if (existedUsernameOrPhone) {
            const duplicatedProp = existedUsernameOrPhone == 'phone' ? 'phone' : 'username'
            return Response.json({ message: `Already there is an account using this ${duplicatedProp}` }, { status: 421 })
        }

        return Response.json({ message: 'Unknown error, try later' }, { status: 421 })
    }
}