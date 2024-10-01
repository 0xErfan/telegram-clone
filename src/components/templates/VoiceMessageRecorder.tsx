import { secondsToFormattedTimeString, showToast, uploadFile } from '@/utils';
import { Button } from '@nextui-org/button';
import { useState, useRef, useEffect } from 'react';
import { PiMicrophoneLight } from 'react-icons/pi';

const VoiceMessageRecorder = () => {

    const [recording, setRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [timer, setTimer] = useState(0);
    const [voiceFile, setVoiceFile] = useState<File | null>(null);
    const mediaRecorderRef = useRef<any>(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
            //@ts-expect-error
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {

            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);

            const file = new File([audioBlob], `voice-message-${Date.now()}.wav`, { type: 'audio/wav' });
            setVoiceFile(file);

            audioChunksRef.current = [];
        };

        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
        setRecording(false);
    };

    useEffect(() => {

        if (!recording) return setTimer(0);

        const updateTimer = () => setTimer((prev) => prev + 1);

        const timerInterval = setInterval(updateTimer, 1000);
        return () => clearInterval(timerInterval);

    }, [recording]);

    const uploadVoice = async () => {

        if (!voiceFile) return

        try {
            setIsLoading(true);
            const uploadedVoiceUrl = await uploadFile(voiceFile);
            console.log(uploadedVoiceUrl)
        } catch (error) {
            showToast(false, 'Upload failed btw.!')
        } finally { setIsLoading(false); }

    };

    const sendMessage = () => {
        uploadVoice();
        setRecording(false);
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
                <div
                    // data-aos='fade-left'
                    className='flex items-center justify-between px-4 md:px-3 absolute rounded-sm inset-0 z-20 size-full bg-black/50 backdrop-blur-xl'
                >

                    <div className='flex items-center gap-2 w-18'>
                        <div className='size-3 rounded-full bg-red-400 animate-pulse'></div>
                        <p>{secondsToFormattedTimeString(timer)}</p>
                    </div>

                    <button onClick={stopRecording} className='text-lightBlue absolute mr-9 inset-x-0 font-bold font-segoeBold'>CANCEL</button>

                    <button onClick={sendMessage} className='w-[100px] h-3/4 rounded-sm animate-pulse flex-center bg-lightBlue'>
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