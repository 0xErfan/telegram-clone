'use client'
import { showToast } from "@/utils"
import useAudio from "@/zustand/audioStore"
import { ElementRef, useEffect, useRef } from "react"

const AudioManager = () => {

    const { isPlaying, setter, voiceData, downloadedAudios } = useAudio(state => state)
    const audioRef = useRef<ElementRef<'audio'> | null>(null)

    const isVoiceFileReadyToPlay = (audioList: typeof downloadedAudios) => {
        return audioList.some(audio => {
            return (audio._id == voiceData._id && !audio.isDownloading && audio.downloaded)
        })
    }

    // effect to listening for audio pause
    useEffect(() => {
        if (audioRef?.current && voiceData?._id && voiceData?.src && !isPlaying) audioRef.current.pause()
    }, [isPlaying, voiceData?._id, voiceData?.src])

    useEffect(() => {
        if (
            isPlaying
            &&
            voiceData?._id
            &&
            voiceData?.src
            &&
            isVoiceFileReadyToPlay(downloadedAudios)
        ) {
            setter({ audioElem: audioRef.current, isPlaying: true })
            audioRef.current?.play()
        }
    }, [isPlaying, downloadedAudios?.length])

    useEffect(() => {

        let timeout: NodeJS.Timeout;

        if (audioRef?.current) {

            const audio = audioRef.current

            audio.onended = () => {
                setter({ isPlaying: false, voiceData: null })
                clearTimeout(timeout)
            }

            audio.onerror = () => {

                showToast(false, 'Failed to download, check your shitty internet!', 2500)

                setter({
                    downloadedAudios: downloadedAudios.filter(audio => audio._id !== voiceData?._id),
                    isPlaying: false,
                    voiceData: null
                })

            }

            audio.oncanplaythrough = () => {

                const addNewVoiceToDownloadedList = () => {

                    const downloadedAudios = useAudio.getState().downloadedAudios;

                    const shouldVoicePlay = downloadedAudios.some(audio => {
                        if (audio._id === voiceData._id && audio.downloaded) return true;
                    })

                    audio[shouldVoicePlay ? 'play' : 'pause']()

                    setter({
                        downloadedAudios: downloadedAudios.map(audio => {
                            if (audio._id === voiceData._id) {
                                audio.downloaded = true
                                audio.isDownloading = false
                            }
                            return audio;
                        }),
                        isPlaying: shouldVoicePlay
                    })
                }

                timeout = setTimeout(addNewVoiceToDownloadedList, 300);
            }

        }

        return () => clearTimeout(timeout)

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