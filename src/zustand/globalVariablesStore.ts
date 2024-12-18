import { MessageModel, RoomModel } from "@/@types/data.t";
import { Socket } from "socket.io-client";
import { create } from "zustand";

export interface Props {

    selectedRoom: null | RoomModel
    mockSelectedRoomData: null | RoomModel
    onlineUsers: { socketID: string, userID: string }[]
    socket: null | Socket
    isRoomDetailsShown: boolean
    shouldCloseAll: boolean
    isChatPageLoaded: boolean
    forceRender: boolean
    createRoom: (type: 'chanel' | 'group') => void

    modalData: {
        isOpen: boolean
        title?: string
        bodyText?: string
        isChecked?: boolean
        isCheckedText?: string
        msgData: (MessageModel & { myId: string, addReplay: (_id: string) => void, edit: (_id: string) => void, pin: (_id: string) => void, isPv?: boolean } | null)
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
    bodyText: "",
    isCheckedText: '',
    isChecked: false,
    msgData: null,
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
    forceRender: false,

    createRoom: () => { },

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