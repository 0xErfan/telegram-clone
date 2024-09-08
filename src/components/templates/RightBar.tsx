'use client'
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import { Suspense, lazy } from "react"
const RoomDetails = lazy(() => import('@/components/templates/RoomDetails'))

const RightBar = () => {

    const { selectedRoom, mockSelectedRoomData } = useGlobalVariablesStore(state => state)

    return (
        (selectedRoom || mockSelectedRoomData) ? <Suspense><RoomDetails /></Suspense> : null
    )
}

export default RightBar