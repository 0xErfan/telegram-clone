import { MessageModel, UserModel, VoiceModel } from "@/@types/data.t";
import { ElementRef } from "react";
import { create } from "zustand";

interface Updater {
    updater: (key: keyof UserModel, value: UserModel[keyof UserModel]) => void
    isPlaying: boolean,
    audioElem: ElementRef<'audio'> | null
    currentTime: number
    voiceData: VoiceModel & MessageModel
    setter: any
}

const useAudio = create<Updater>(set => ({

    isPlaying: false,
    audioElem: null,
    currentTime: 0,
    voiceData: {} as VoiceModel & MessageModel,

    updater(key: keyof UserModel, value: UserModel[keyof UserModel]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useAudio;