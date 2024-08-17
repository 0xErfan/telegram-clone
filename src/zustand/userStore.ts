import { UserModel } from "@/@types/data.t";
import { create } from "zustand";

interface Updater {
    updater: (key: keyof UserModel, value: UserModel[keyof UserModel]) => void
    setter: any
    isLogin: boolean
}

const useUserStore = create<UserModel & Updater>(set => ({
    name: '',
    lastName: '',
    username: '',
    password: '',
    avatar: '',
    createdAt: '',
    isLogin: false,

    updater(key: keyof UserModel, value: UserModel[keyof UserModel]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useUserStore;