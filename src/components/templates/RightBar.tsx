'use client'
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import { Suspense, lazy } from "react"
const RoomDetails = lazy(() => import('@/components/templates/RoomDetails'))

const RightBar = () => {

    const roomID = useGlobalVariablesStore(state => state.selectedRoom?._id)

    return (
        roomID && <Suspense><RoomDetails /></Suspense>
    )
}

export default RightBar