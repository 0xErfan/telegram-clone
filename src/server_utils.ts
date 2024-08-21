'use server'

import axios from "axios"
import { UserModel } from "./@types/data.t"
import { cookies } from "next/headers"

const isLoginCheck = async (): Promise<UserModel | null> => {
    const userData = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth/me`, cookies().get('token')?.value)
    return userData.data ?? null
}

export {
    isLoginCheck,
}