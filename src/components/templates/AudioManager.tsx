'use client'
import useAudio from "@/zustand/audioStore"
import { ElementRef, useEffect, useRef } from "react"

const AudioManager = () => {

    const { isPlaying, setter, voiceData } = useAudio(state => state)

    const audioRef = useRef<ElementRef<'audio'> | null>(null)

    useEffect(() => {
        if (voiceData._id && voiceData.src) {
            setter({ audioElem: audioRef.current })
            audioRef.current?.play()
        }
    }, [voiceData._id, voiceData.src])

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
                setter({ isVoiceDownloaded: true, isPlaying: false })
                audioRef.current?.pause()
            }

        }
    }, [voiceData?._id])

    return (
        voiceData
            ?
            <audio
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