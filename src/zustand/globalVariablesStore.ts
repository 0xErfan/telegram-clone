import { RoomModel } from "@/@types/data.t";
import { Socket } from "socket.io-client";
import { create } from "zustand";

interface Props {
    selectedRoom: null | RoomModel
    onlineUsers: { socketID: string, userID: string }[]
    socket: null | Socket
    isGroupDetailsShown: boolean
}

interface Updater {
    updater: (key: keyof Props, value: Props[keyof Props]) => void
    setter: any
}

const useGlobalVariablesStore = create<Props & Updater>(set => ({
    selectedRoom: null,
    onlineUsers: [],
    socket: null,
    isGroupDetailsShown: true,

    updater(key: keyof Props, value: Props[keyof Props]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useGlobalVariablesStore;