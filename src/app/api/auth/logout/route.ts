import { cookies } from "next/headers";

export const GET = async () => {

    const cookie = cookies()

    try {
        cookie.delete('token')
        return Response.json('Done bud', { status: 200 })
    } catch (err) {
        console.log(err)
        return Response.json({ message: 'Unknown error, try later.' }, { status: 500 })
    }
}