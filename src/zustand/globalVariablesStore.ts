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

    modalData: {
        isOpen: boolean
        title?: string
        bodyText?: string
        isChecked?: boolean
        isCheckedText?: string
        okText?: string
        cancelText?: string
        onSubmit: () => void
        onClose?: () => void
        resetModal?: () => void
    }
}

interface Updater {
    updater: (key: keyof Props, value: Props[keyof Props]) => void
    setter: any
}

const defaultModalData = {
    isOpen: false,
    okText: 'Ok',
    cancelText: 'Cancel',
    title: 'Modal',
    bodyText: "Modal buddy",
    isCheckedText: '',
    isChecked: false,
    onSubmit: () => { },
    onClose: () => { },
}

const useGlobalVariablesStore = create<Props & Updater>(set => ({
    selectedRoom: null,
    mockSelectedRoomData: null,
    onlineUsers: [],
    socket: null,
    shouldCloseAll: false,
    isRoomDetailsShown: false,
    isChatPageLoaded: false,

    modalData: {
        ...defaultModalData,
        resetModal: () => set(prev => ({ modalData: ({ ...prev.modalData, ...defaultModalData }) }))
    },

    updater(key: keyof Props, value: Props[keyof Props]) {
        set({ [key]: value })
    },

    setter: set
}))

export default useGlobalVariablesStore;