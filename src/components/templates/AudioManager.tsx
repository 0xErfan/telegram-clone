'use client'
import useAudio from "@/zustand/audioStore"
import { ElementRef, useEffect, useRef } from "react"

const AudioManager = () => {

    const { isPlaying, setter, voiceData } = useAudio(state => state)
    const audioRef = useRef<ElementRef<'audio'> | null>(null)

    useEffect(() => {
        if (voiceData._id && voiceData.src) {
            setter({ audioElem: audioRef.current })
        }
    }, [voiceData._id, voiceData.src])

    useEffect(() => {
        if (voiceData.src && audioRef?.current) {
            audioRef?.current[isPlaying ? 'pause' : 'play']()
        }
    }, [isPlaying, voiceData.src])

    console.log(isPlaying, audioRef.current, voiceData)

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