import connectToDB from "@/db/db";
import UserModel from "@/models/User";
import { compare } from "bcrypt";
import { tokenGenerator } from "@/utils";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {

    try {
        await connectToDB()

        const { payload, password } = await req.json()

        const userData = await UserModel.findOne({ $or: [{ username: payload }, { phone: isNaN(payload) ? 0 : payload }] })
        if (!userData) return Response.json({ message: 'No user exist with this username or password.' }, { status: 401 })

        if (! await compare(password, userData.password)) return Response.json({ message: 'Incorrect username/phone or password' }, { status: 401 })

        const token = tokenGenerator(userData.phone, 7)

        cookies().set('token', token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 6 })
        return Response.json(userData, { status: 200 })

    } catch (err) {
        console.log(err)
        return Response.json({ message: 'Unknown error, try later.' }, { status: 500 })
    }
}