import connectToDB from "@/db/db";
import UserModel from "@/models/User";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { tokenGenerator } from "@/utils";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        await connectToDB()

        const { name, lastname, username, phone } = req.body

        const password = await hash(req.body.password, 12)

        const userData = await UserModel.create({ name, username, lastname, password, phone })

        const token = tokenGenerator(userData.phone, 7)

        return res
            .setHeader("Set-Cookie", serialize("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 }))
            .status(201).json({ userData, message: 'You signed up successfully.' })

    } catch (err: any) {

        const duplicatedInputs = Object.keys(err.errorResponse?.keyPattern).join('')

        if (duplicatedInputs) {
            const duplicatedProp = duplicatedInputs == 'phone' ? 'phone' : 'username'
            return res.status(421).json({ message: `Already there is an account using ${duplicatedProp}` })
        }

        return res.status(421).json({ message: 'Unknown error, try later' })
    }
}

export default POST;