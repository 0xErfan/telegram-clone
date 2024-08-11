import { UserModel } from "@/@types/data.t";
import { create } from "zustand";

interface Updater {
    updater: (key: keyof UserModel, value: UserModel[keyof UserModel]) => void
    setter: any
}

const useUserStore = create<UserModel & Updater>(set => ({
    name: '',
    lastName: '',
    username: '',
    password: '',
    avatar: '',
    createdAt: '',
    updater(key: keyof UserModel, value: UserModel[keyof UserModel]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useUserStore;