import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        return res
            .setHeader("Set-Cookie", serialize("token", "", { httpOnly: true, path: "/", maxAge: 0 }))
            .status(201).json({ message: 'You logged out successfully.' })

    } catch (err) {
        console.log(err)
        return res.status(421).json({ message: 'Unknown error, try later.' })
    }
}

export default GET;