import connectToDB from "@/db/db";
import UserModel from "@/models/User";
import { tokenDecoder } from "@/utils";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        await connectToDB()

        const tokenFromReq = req.cookies?.token
        const tokenFromBody = req.body

        const token: string | undefined = tokenFromBody || tokenFromReq

        if (!token) return res.status(401).json({ message: 'You are not logged in' })

        const verifiedToken = tokenDecoder(token) as { email: string }

        const userData = await UserModel.findOne({ email: verifiedToken?.email })

        if (!userData || !verifiedToken) {
            res.setHeader("Set-Cookie", serialize("token", "", { httpOnly: true, path: "/", maxAge: 0 }))
            return res.status(401).json({ message: 'No user exist with this username or password!' })
        }

        return res.status(200).send(userData)

    } catch (err) {
        return res.status(500).json({ message: 'Unknown error, try later.' })
    }
}

export default PUT;