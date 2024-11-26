import { UserModel } from "@/@types/data.t";
import { create } from "zustand";

interface Updater {
    updater: (key: keyof UserModel, value: UserModel[keyof UserModel]) => void
    setter: any
}

const useUserStore = create<UserModel & Updater>(set => ({
    _id: '',
    name: '',
    lastName: '',
    username: '',
    password: '',
    phone: '0',
    rooms: [],
    avatar: '',
    createdAt: '',
    isLogin: false,
    biography: '',
    status: 'offline',
    updatedAt: '',
    roomMessageTrack: [],

    updater(key: keyof UserModel, value: UserModel[keyof UserModel]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useUserStore;