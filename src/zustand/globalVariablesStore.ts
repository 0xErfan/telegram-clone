import { Socket } from "socket.io-client";
import { create } from "zustand";

interface Props {
    selectedChat: null | string
    socket: null | Socket
}

interface Updater {
    updater: (key: keyof Props, value: Props[keyof Props]) => void
    setter: any
}

const useGlobalVariablesStore = create<Props & Updater>(set => ({
    selectedChat: null,
    socket: null,

    updater(key: keyof Props, value: Props[keyof Props]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useGlobalVariablesStore;