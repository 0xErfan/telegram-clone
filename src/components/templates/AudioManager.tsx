'use client'
import useAudio from "@/zustand/audioStore"
import { ElementRef, useEffect, useRef } from "react"

const AudioManager = () => {

    const { isPlaying, setter, voiceData, downloadedAudios } = useAudio(state => state)

    const audioRef = useRef<ElementRef<'audio'> | null>(null)

    useEffect(() => {

        !downloadedAudios.includes(voiceData._id) && audioRef?.current?.pause()

        if (voiceData._id && voiceData.src) {
            setter({ audioElem: audioRef.current, isPlaying: true })
            audioRef.current?.play()
        }

    }, [voiceData._id, voiceData.src, downloadedAudios])

    useEffect(() => {
        voiceData?.src
            &&
            audioRef?.current
            &&
            audioRef.current[isPlaying ? 'play' : 'pause']()
    }, [isPlaying])

    useEffect(() => {
        if (audioRef?.current) {

            audioRef.current.onended = () => setter({ isPlaying: false });

            audioRef.current.oncanplaythrough = () => {
                setter({
                    isVoiceDownloaded: true,
                    downloadedAudios: downloadedAudios.includes(voiceData._id) ? downloadedAudios : [...downloadedAudios, voiceData._id]
                })
            }

        }
    }, [voiceData?._id])

    return (
        voiceData
            ?
            <audio
                autoSave="true"
                key={voiceData._id}
                ref={audioRef}
                className="hidden"
                src={voiceData.src}>
            </audio>
            :
            null
    )
}

export default AudioManager