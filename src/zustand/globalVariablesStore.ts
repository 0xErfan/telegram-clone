import { RoomModel } from "@/@types/data.t";
import { Socket } from "socket.io-client";
import { create } from "zustand";

interface Props {
    selectedRoom: null | RoomModel
    mockSelectedRoomData: null | RoomModel
    onlineUsers: { socketID: string, userID: string }[]
    socket: null | Socket
    isRoomDetailsShown: boolean
    shouldCloseAll: boolean
    isChatPageLoaded: boolean
}

interface Updater {
    updater: (key: keyof Props, value: Props[keyof Props]) => void
    setter: any
}

const useGlobalVariablesStore = create<Props & Updater>(set => ({
    selectedRoom: null,
    mockSelectedRoomData: null,
    onlineUsers: [],
    socket: null,
    shouldCloseAll: false,
    isRoomDetailsShown: false,
    isChatPageLoaded: false,

    updater(key: keyof Props, value: Props[keyof Props]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useGlobalVariablesStore;