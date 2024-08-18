import connectToDB from "@/db/db";
import UserModel from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcrypt";
import { serialize } from "cookie";
import { tokenGenerator } from "@/utils";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        await connectToDB()

        const { payload, password } = req.body
        const userData = await UserModel.findOne({ $or: [{ username: payload }, { phone: payload }] })

        if (!userData) return res.status(401).json({ message: 'No user exist with this username or password.' })

        if (! await compare(password, userData.password)) return res.status(401).json({ message: 'Incorrect username/phone or password' })

        const token = tokenGenerator(userData.phone, 7)

        return res
            .setHeader("Set-Cookie", serialize("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 6 }))
            .status(201).json({ userData, message: 'You logged in successfully.' })

    } catch (err) {
        console.log(err)
        return res.status(421).json({ message: 'Unknown error, try later.' })
    }
}

export default POST;