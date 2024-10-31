import { useOnScreen } from '@/hook/useOnScreen'
import { formattedDateString, getTimeFromDate, scrollToMessage, secondsToFormattedTimeString } from '@/utils'
import { FaPlay } from "react-icons/fa";
import { FaPause, FaArrowDown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import useSockets from '@/zustand/useSockets'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { MessageModel, VoiceModel } from '@/@types/data.t';
import useGlobalVariablesStore from '@/zustand/globalVariablesStore';
import type { Props as globalVariablesStoreType } from '@/zustand/globalVariablesStore';
import MessageActions from './MessageActions';
import useAudio from '@/zustand/audioStore';

interface Props {
    myId: string,
    addReplay: (_id: string) => void
    edit: (data: MessageModel) => void
    isPv?: boolean
    voiceData?: VoiceModel | null,
    stickyDate: string | null
}

const Message = (msgData: MessageModel & Props) => {

    const {
        createdAt,
        message,
        seen,
        _id,
        sender,
        myId,
        roomID,
        replayedTo,
        isEdited,
        addReplay,
        edit,
        isPv = false,
        voiceData: voiceDataProp,
        stickyDate,
    } = msgData

    const messageRef = useRef(null)
    const modalMsgID = useGlobalVariablesStore(state => state.modalData.msgData?._id)
    const isFromMe = sender?._id === myId
    const isInViewport = useOnScreen(messageRef)
    const messageTime = getTimeFromDate(createdAt)
    const [isMounted, setIsMounted] = useState(false)
    const { rooms } = useSockets(state => state)
    const setter = useGlobalVariablesStore(state => state.setter)

    // voice state variables
    const { isPlaying, voiceData, setter: audioUpdater, downloadedAudios, audioElem } = useAudio(state => state)
    const [voiceCurrentTime, setVoiceCurrentTime] = useState(0)

    const songWaves = useMemo(() => {

        const waves = Array(20).fill(0).map((_, index) => {

            const randomHeight = Math.trunc(Math.random() * 12) + 5;

            return (
                <div
                    key={index}
                    className={`w-[3px] rounded-full bg-darkGray z-40`}
                    style={{ height: `${randomHeight}px` }}
                />
            );
        })

        return waves;

    }, [])

    useEffect(() => {

        // @ts-expect-error
        let socket: null | typeof socket = null;

        (() => {

            socket = useSockets.getState().rooms;

            // socket?.on('listenToVoice', ({voiceID}) => {    
            //     audioUpdater(prev => ({voiceData: {...prev.voiceData, playedBy: prev.voiceData?.playedBy?.map(id => {
            //         if (id === voiceID) {
            //             id = voiceID + Date.now
            //         };
            //         return id;
            //     })}}))
            // })

        })()

        return () => socket?.off('listenToVoice')
    }, [])

    const togglePlayVoice = () => {

        const savedVoiceData = downloadedAudios.find(voice => voice._id === _id)

        if (!savedVoiceData) {
            audioUpdater({
                isPlaying: false,
                voiceData: { ...voiceDataProp, ...msgData },
                downloadedAudios: [...downloadedAudios, { _id, isDownloading: true, downloaded: false }]
            })
            return
        }

        if (savedVoiceData.isDownloading) {
            audioUpdater({
                isPlaying: false,
                voiceData: null,
                downloadedAudios: downloadedAudios.filter(audio => audio._id !== _id)
            })
            return
        }

        audioUpdater({
            isPlaying: voiceData?._id == _id ? !isPlaying : true,
            voiceData: { ...voiceDataProp, ...msgData }
        })

        // send listenToVoice socket event
        if (!isFromMe && !voiceDataProp?.playedBy?.includes(myId)) {
            const socket = useSockets.getState().rooms
            socket?.emit('listenToVoice', { userID: myId, voiceID: _id, roomID })
        }

    }

    const openProfile = () => {
        setter({
            mockSelectedRoomData: sender,
            shouldCloseAll: true,
            isRoomDetailsShown: true
        })
    }

    const updateModalMsgData = () => {
        setter((prev: globalVariablesStoreType) => ({
            modalData: {
                ...prev.modalData,
                msgData,
                edit,
                reply: () => addReplay(_id)
            }
        }))
    }

    useEffect(() => {

        const updateVoiceWave = () => {

            const totalTime = audioElem?.duration
            const currentTime = audioElem?.currentTime
            const currentTimeInPercentage = Math.trunc((currentTime! * 100) / totalTime!)

            setVoiceCurrentTime(Math.trunc(currentTime!))
        }

        const interval: NodeJS.Timeout = setInterval(() => {
            if (!isPlaying) return clearInterval(interval)
            updateVoiceWave()
        }, 300)

        return () => clearInterval(interval)

    }, [audioElem?.currentTime])

    useEffect(() => {

        if (sender?._id) {

            const isAlreadySeenByThisUser = isFromMe ? true : seen?.includes(myId);

            if (!isAlreadySeenByThisUser && isInViewport) {
                rooms?.emit('seenMsg', {
                    seenBy: myId,
                    sender,
                    msgID: _id,
                    roomID
                });
            }
        }

    }, [isInViewport, isFromMe]);

    useEffect(() => { setIsMounted(true) }, [])

    return (
        <>

            {
                stickyDate
                    ?
                    <div
                        onClick={() => messageRef?.current?.scrollIntoView({ behavior: 'smooth' })}
                        className='sticky top-3 inset-x-0 text-[12px] z-50 bg-white/10 w-fit m-auto text-center rounded-2xl py-1 px-3 cursor-pointer'>{formattedDateString(stickyDate)}
                    </div>
                    : null
            }

            <div
                ref={messageRef}
                className={`
                flex items-end gap-2 relative
                ${isFromMe ? 'flex-row-reverse' : 'flex-row'}
                ${!isPv && (isFromMe ? 'bottomBorderRight' : 'bottomBorderLeft')}
                ${isMounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-0'}
                transition-all
                duration-500
                overflow-hidden
                ch:overflow-hidden
            `}
            >

                {
                    !isFromMe && !isPv &&
                    <div onClick={openProfile} className='cursor-pointer'>
                        {
                            sender.avatar
                                ?
                                <Image
                                    src={sender.avatar}
                                    width={35}
                                    height={35}
                                    className='size-[35px] rounded-full bg-center'
                                    alt='avatar'
                                />
                                :
                                <div className='size-[35px] rounded-full bg-lightBlue flex-center text-center font-bold text-xl pb-1'>{sender.name[0]}</div>
                        }
                    </div>
                }

                <div
                    onClick={updateModalMsgData}
                    onContextMenu={e => { e.preventDefault(), updateModalMsgData() }}
                    className={` tw-min-w-[120px] ${isFromMe ? 'bg-darkBlue rounded-l-md rounded-tr-xl text-right pl-1 pr-3' : `bg-white/10 rounded-r-md rounded-tl-xl text-left pr-1 ${isPv ? 'pl-1' : 'pl-3'}`} relative w-fit max-w-[80%] min-w-24 xl:max-w-[60%]`}
                >

                    {
                        (!isFromMe && !isPv)
                        &&
                        <p dir='auto' className='w-full text-[14px] font-bold mt-px font-segoeBold text-[#C8504F]'>{sender.name}</p>
                    }

                    <div className='flex flex-col text-[16px] gap-1 p-1 mt-1 break-words mb-[13px]'>
                        {
                            replayedTo
                            &&
                            <div
                                onClick={e => { e.stopPropagation(), scrollToMessage(replayedTo?.msgID) }}
                                className={`${isFromMe ? 'bg-lightBlue/25 rounded-l-md' : 'bg-green-500/15 rounded-r-md'} cursor-pointer rounded-md rounded-t-md text-sm relative w-full py-1 px-3 overflow-hidden`}
                            >
                                <span className={`absolute ${isFromMe ? 'bg-white' : 'bg-green-500'} left-0  inset-y-0 w-[3px] h-full `}></span>
                                <p className='font-extrabold font-segoeBold break-words text-start line-clamp-1 overflow-ellipsis'>{replayedTo.username}</p>
                                {/* here should be checked for different message types like file or locations */}
                                <p className='font-thin break-words line-clamp-1 overflow-ellipsis text-left'>{replayedTo.message || 'Voice Message'}</p>
                            </div>
                        }
                        {
                            voiceDataProp &&
                            <div
                                onClick={e => e.stopPropagation()}
                                className='flex items-center gap-3 bg-inherit w-full mt-2'
                            >

                                <div
                                    onClick={togglePlayVoice}
                                    className={`rounded-full size-10 cursor-pointer relative flex-center overflow-hidden ${isFromMe ? 'bg-white text-darkBlue' : 'bg-darkBlue text-white'}`}
                                >
                                    {
                                        downloadedAudios &&
                                        <>
                                            {
                                                voiceData?._id == _id
                                                    ?
                                                    (
                                                        downloadedAudios?.some(audio => audio._id === _id && audio.isDownloading)
                                                            ?
                                                            <span className={`absolute inset-0 flex-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] bg-inherit border-2 rounded-full ${isFromMe ? 'border-darkBlue' : 'border-none'} h-[90%]`}>
                                                                <span className={`${isFromMe ? 'origin-left bg-white' : 'bg-darkBlue'} size-4 loader mb-2 absolute left-0 top-0 block rounded-full z-20`}></span>
                                                                <IoClose className='size-6 z-30' />
                                                            </span>
                                                            :
                                                            downloadedAudios?.some(audio => audio._id === _id && audio.downloaded)

                                                                ?
                                                                <>
                                                                    {(voiceData._id === _id && isPlaying) && <FaPause data-aos='zoom-in' className='size-5' />}
                                                                    {(voiceData._id !== _id || !isPlaying) && <FaPlay data-aos='zoom-in' className='ml-1' />}
                                                                </>
                                                                :
                                                                <FaArrowDown data-aos='zoom-in' className='size-5' />
                                                    )
                                                    :
                                                    downloadedAudios?.some(audio => audio._id === _id && audio.downloaded)

                                                        ?
                                                        <FaPlay data-aos='zoom-in' className='ml-1' />
                                                        :
                                                        <FaArrowDown data-aos='zoom-in' className='size-5' />
                                            }
                                        </>
                                    }
                                </div>

                                <div className='flex flex-col gap-1 justify-center'>

                                    <div className='*:text-darkGray line-clamp-1 overflow-hidden text-nowrap flex items-center gap-[2px] relative'>
                                        {songWaves}
                                    </div>

                                    <div className='flex items-center gap-px text-[12px] mr-auto text-darkGray'>

                                        {
                                            (voiceData?._id === _id && isPlaying)
                                                ?
                                                secondsToFormattedTimeString(voiceCurrentTime)
                                                :
                                                secondsToFormattedTimeString(voiceDataProp.duration)
                                        }

                                        {
                                            voiceDataProp?.playedBy
                                            &&
                                            !voiceDataProp?.playedBy?.length
                                            &&
                                            <div className='size-2 ml-2 rounded-full bg-white' />
                                        }

                                    </div>

                                </div>

                            </div>
                        }
                        <p dir='auto'>{message}</p>
                    </div>

                    <span className={`flex items-center justify-end gap-1 absolute bottom-px right-3 w-full text-[12px]  ${isFromMe ? 'text-[#B7D9F3]' : 'text-darkGray'} text-right`}>
                        <p className='whitespace-nowrap'>{isEdited && 'edited '} {messageTime}</p>
                        {
                            (isFromMe && seen?.length) ?
                                <Image
                                    src='/shapes/seen.svg'
                                    width={15}
                                    height={15}
                                    className={`size-[15px] rounded-full bg-center duration-500 ${(isFromMe && seen?.length) ? 'opacity-100' : 'opacity-0'}`}
                                    alt='avatar'
                                />
                                : null
                        }
                    </span>

                </div>

                {
                    modalMsgID === _id ? <MessageActions /> : null
                }

            </div>
        </>

    )
}

export default Message;