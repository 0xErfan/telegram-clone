'use client'
import AuthenticationForm from "@/components/templates/AuthenticationForm"
import useUserStore from "@/zustand/userStore"
import { ReactNode } from "react"

const Authentication = ({ children }: { children: ReactNode }) => {

    const isLogin = useUserStore(state => state.isLogin)

    return (
        <>
            {
                isLogin
                    ?
                    { children }
                    :
                    <AuthenticationForm />
            }
        </>
    )
}

export default Authentication