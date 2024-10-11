import { MessageModel, UserModel, VoiceModel } from "@/@types/data.t";
import { ElementRef } from "react";
import { create } from "zustand";

interface Updater {
    updater: (key: keyof UserModel, value: UserModel[keyof UserModel]) => void
    isPlaying: boolean,
    audioElem: ElementRef<'audio'> | null
    currentTime: number
    voiceData: VoiceModel & MessageModel
    downloadedAudios: { _id: string, downloaded: boolean, isDownloading: boolean }[]
    setter: any
}

const useAudio = create<Updater>(set => ({

    isPlaying: false,
    audioElem: null,
    currentTime: 0,
    isVoiceDownloaded: false,
    voiceData: {} as VoiceModel & MessageModel,
    downloadedAudios: [],

    updater(key: keyof UserModel, value: UserModel[keyof UserModel]) {
        set({ [key]: value })
    },
    setter: set
}))

export default useAudio;