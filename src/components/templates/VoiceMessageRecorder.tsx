import { MessageModel } from '@/@types/data.t';
import { secondsToFormattedTimeString, showToast, uploadFile } from '@/utils';
import useGlobalVariablesStore from '@/zustand/globalVariablesStore';
import useSockets from '@/zustand/useSockets';
import useUserStore from '@/zustand/userStore';
import { Button } from '@nextui-org/button';
import { useState, useRef, useEffect } from 'react';
import { PiMicrophoneLight } from 'react-icons/pi';

interface Props {
    replayData: MessageModel
    closeEdit: () => void
    closeReplay: () => void
}

const VoiceMessageRecorder = ({ replayData, closeEdit, closeReplay }: Props) => {

    const [recording, setRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [timer, setTimer] = useState(0);
    const mediaRecorderRef = useRef<any>(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(timer)

    const startRecording = async () => {

        if (!('mediaDevices' in navigator)) return showToast(false, 'your shitty browser is not supporting voice recording!')

        try {

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            //@ts-expect-error
            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => audioChunksRef.current.push(event.data)

            mediaRecorderRef.current.onstop = () => {

                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg' });
                const url = URL.createObjectURL(audioBlob);
                const file = new File([audioBlob], `voice-message-${Date.now()}.ogg`, { type: 'audio/ogg' });

                setAudioURL(url);
                uploadVoice(file)

                audioChunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setRecording(true);

        } catch (error) { showToast(false, 'Failed to find your device voice btw!') }

    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
        mediaRecorderRef.current?.getTracks().forEach((track: any) => track?.stop());

        timerRef.current = 0

        setAudioURL('')
        setRecording(false);
        setIsLoading(false)
    };

    const cancelRecording = () => {
        mediaRecorderRef.current = null
        setRecording(false);
        setIsLoading(false)
    }

    useEffect(() => {

        if (isLoading) return
        if (!recording) return setTimer(0);

        const updateTimer = () => {
            setTimer(prev => {
                timerRef.current = prev + 1
                return prev + 1
            })
        };

        const timerInterval = setInterval(updateTimer, 1000);
        return () => clearInterval(timerInterval);

    }, [recording, isLoading]);

    const sendVoiceMessage = (voiceSrc: string, voiceDuration: number) => {

        const socket = useSockets.getState().rooms
        const myData = useUserStore.getState()
        const selectedRoom = useGlobalVariablesStore.getState().selectedRoom

        const roomHistory = myData.rooms.some(room => { if (room._id === selectedRoom?._id) return true })

        const voiceData = {
            src: voiceSrc,
            duration: voiceDuration,
            playedBy: []
        }

        if (roomHistory) {
            socket?.emit('newMessage', {
                roomID: selectedRoom?._id,
                message: '',
                sender: myData,
                replayData: replayData ?
                    {
                        targetID: replayData?._id,
                        replayedTo: {
                            message: replayData?.message,
                            msgID: replayData?._id,
                            username: replayData.sender?.name
                        }
                    }
                    : null,
                voiceData
            })
        } else {
            socket?.emit('createRoom', {
                newRoomData: selectedRoom, message: {
                    sender: myData, message: '', voiceData, replayData: replayData ?
                        {
                            targetID: replayData?._id,
                            replayedTo: {
                                message: replayData?.message,
                                msgID: replayData?._id,
                                username: replayData.sender?.name
                            }
                        }
                        : null
                }
            });
        }

        socket?.on('newMessage', stopRecording)

        closeEdit()
        closeReplay()
    }

    const uploadVoice = async (voiceFile: File) => {

        setIsLoading(true)
        if (!uploadFile) return showToast(false, 'did not get the file bud')

        try {

            const uploadedVoiceUrl = await uploadFile(voiceFile);
            sendVoiceMessage(uploadedVoiceUrl as string, timerRef.current)

        } catch (error) {
            showToast(false, 'Upload failed btw.!')
            stopRecording()
        }

    };

    return (
        <div className="shrink-0 basis-[3%] size-6 z-10">

            <PiMicrophoneLight
                onClick={startRecording}
                className="shrink-0 basis-[7%] size-6 cursor-pointer"
            />

            {
                recording
                &&
                <div className='flex items-center justify-between px-4 md:px-3 absolute rounded-sm inset-0 z-20 size-full bg-black/50 backdrop-blur-xl'>

                    <div className='flex items-center gap-2 w-18'>
                        <div className='size-3 rounded-full bg-red-400 animate-pulse'></div>
                        <p>{secondsToFormattedTimeString(timer)}</p>
                    </div>

                    <button onClick={cancelRecording} className='text-lightBlue absolute mr-9 inset-x-0 font-bold font-segoeBold'>CANCEL</button>

                    <button onClick={() => mediaRecorderRef.current.stop()} className='w-[100px] h-3/4 rounded-sm animate-pulse flex-center z-[2000] bg-lightBlue'>
                        {
                            isLoading
                                ?
                                <Button
                                    isLoading={true}
                                    style={{ backgroundColor: 'inherit', position: 'absolute', right: '20px', height: '20px', color: 'white', }}
                                />
                                :
                                'SEND'
                        }
                    </button>

                </div>
            }

            {audioURL && <audio className='hidden' controls src={audioURL} />}

        </div>
    );
};

export default VoiceMessageRecorder;