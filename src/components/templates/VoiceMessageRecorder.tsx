import { useState, useRef } from 'react';
import { PiMicrophoneLight } from 'react-icons/pi';

const VoiceMessageRecorder = () => {

    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef<any>(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);
            audioChunksRef.current = [];
        };

        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null
        setRecording(false);
    };

    return (
        <div className="shrink-0 basis-[7%] size-6 cursor-pointer z-10">

            <PiMicrophoneLight
                onClick={startRecording}
                className="shrink-0 basis-[7%] size-6 cursor-pointer"
            />

            {
                recording
                &&
                <div
                    // data-aos='fade-left'
                    className='flex items-center justify-between px-3 absolute rounded-sm inset-0 z-20 size-full bg-black/50 backdrop-blur-xl'
                >

                    <div className='flex items-center gap-2'>
                        <div className='size-3 rounded-full bg-red-400 animate-pulse'></div>
                        <p>12:30</p>
                    </div>

                    <button onClick={stopRecording} className='text-lightBlue font-bold font-segoeBold'>CANCEL</button>

                    <button className='w-[100px] h-3/4 rounded-sm animate-pulse flex-center bg-lightBlue'>Send</button>

                </div>
            }

            {audioURL && <audio className='hidden' controls src={audioURL} />}

        </div>
    );
};

export default VoiceMessageRecorder;