import { NextApiRequest, NextApiResponse } from "next";
import { compare, hash } from "bcrypt";
import connectToDB from "@/db/db";
import UserModel from "@/models/User";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        await connectToDB()

        const { compare: passwordToCompare, password, _id } = req.body
        const userData = await UserModel.findOne({ _id })

        if (passwordToCompare) { // if the compare have value, it means we only want this api to compare the password and not change it.
            if (! await compare(passwordToCompare, userData.password)) {
                return res.status(401).json({ message: 'Wrong password' })
            } else {
                return res.status(200).json({ message: 'Right password' })
            }
        } else {
            const hashedPassword = await hash(password, 12)
            await UserModel.findOneAndUpdate({ _id }, { password: hashedPassword })
            return res.status(200).json({ message: 'Password changed successfully (:' })
        }

    } catch (err) {
        console.log(err)
        return res.status(421).json({ message: 'Unknown error, try later.' })
    }
}

export default POST;