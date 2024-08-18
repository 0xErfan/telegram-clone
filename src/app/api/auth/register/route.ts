import connectToDB from "@/db/db";
import UserModel from "@/models/User";
import { tokenGenerator } from "@/utils";
import { hash } from "bcrypt";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {

    try {

        await connectToDB()

        const { name, lastName, username, phone, password: purePass } = await req.json()

        const password = await hash(purePass, 12)
        const userData = await UserModel.create({ name, username, lastName, password, phone })
        const token = tokenGenerator(userData.phone, 7)

        cookies().set('token', token, { httpOnly: true, maxAge: 60 * 60 * 14 })
        return Response.json(userData, { status: 201 })

    } catch (err: any) {

        const duplicatedInputs = Object.keys(err.errorResponse?.keyPattern).join('')

        if (duplicatedInputs) {
            const duplicatedProp = duplicatedInputs == 'phone' ? 'phone' : 'username'
            return Response.json({ message: `Already there is an account using this ${duplicatedProp}` }, { status: 421 })
        }

        return Response.json({ message: 'Unknown error, try later' }, { status: 421 })
    }
}