import { Socket } from "socket.io-client";
import { create } from "zustand";

interface Props {
    rooms: Socket | null
    roomsNs: Socket | null
    updater: (key: keyof Props, value: Props[keyof Props]) => void
    setter: any
}

const useSockets = create<Props>(set => ({

    rooms: null,
    roomsNs: null,

    updater(key: keyof Props, value: Props[keyof Props]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useSockets;