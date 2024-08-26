'use client'
import AppLoader from "@/components/modules/AppLoader"
import useUserStore from "@/zustand/userStore"
import axios from "axios"
import { ReactNode, lazy, useEffect, useState } from "react"
const AuthenticationForm = lazy(() => import('@/components/templates/AuthenticationForm'))

const Authentication = ({ children }: { children: ReactNode }) => {

    const [isLoading, setIsLoading] = useState(true)
    const { setter, updater, isLogin } = useUserStore(state => state)

    useEffect(() => {
        (
            async () => {

                try {
                    const userData = await axios.post('/api/auth/me')

                    if (userData.status == 200) {
                        setter({ ...userData.data._doc, rooms: userData.data?.rooms })
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

export default Authentication;