'use client'
import AppLoader from "@/components/modules/AppLoader"
import AuthenticationForm from "@/components/templates/AuthenticationForm"
import useUserStore from "@/zustand/userStore"
import axios from "axios"
import { ReactNode, useEffect, useState } from "react"

const Authentication = ({ children }: { children: ReactNode }) => {

    const [isLoading, setIsLoading] = useState(true)
    const { setter, updater, isLogin } = useUserStore(state => state)

    useEffect(() => {
        (
            async () => {
                
                try {
                    const userData = await axios.post('/api/auth/me')

                    if (userData.status == 200) {
                        console.log(userData)
                        setter({...userData.data._doc, rooms: userData.data?.rooms})
                        updater('isLogin', true)
                    }

                } catch (error) { }
                finally { setIsLoading(false) }
            }
        )()
    }, [])

    if (isLoading) return <AppLoader />

    return (
        <>
            {
                isLogin
                    ?
                    <>
                        {children}
                    </>
                    :
                    <AuthenticationForm />
            }
        </>
    )
}

export default Authentication