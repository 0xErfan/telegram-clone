import { useEffect, useRef, useState } from "react";
import LeftBarContainer from "./LeftBarContainer";
import Peer from 'peerjs';
import useUserStore from "@/zustand/userStore";
import { copyText, showToast } from "@/utils";

const VideoChat = ({ getBack }: { getBack: () => void }) => {

    const [myStream, setMyStream] = useState<MediaStream>();
    const [peerReceiverID, setPeerReceiverID] = useState('');
    const myId = useUserStore(state => state._id);
    const userVideoStream = useRef<HTMLVideoElement | null>(null);
    const myVideoStream = useRef<HTMLVideoElement | null>(null);
    const [myPeer] = useState(new Peer(myId));

    useEffect(() => {

        const handleCall = (call: any) => {

            const didAnswer = prompt('someone calling you, wanna answer?', 'Hell ya')
            if (didAnswer) call.answer(myStream);

            call.on('stream', (remoteStream: MediaStream) => {
                console.log('Received remote stream:', remoteStream);
                if (userVideoStream.current) {
                    userVideoStream.current.srcObject = remoteStream;
                }
            });

        };

        myPeer.on('open', () => {
            myPeer.on('call', handleCall);
        })

        return () => {
            myPeer.disconnect();
            myPeer.destroy();
        };

    }, []);

    const toggleMyStream = () => {
        if (myStream) {
            myStream.getTracks().forEach(track => track.stop());
            setMyStream(undefined);
            if (myVideoStream.current) {
                myVideoStream.current.srcObject = null; // Clear video element  
            }
        } else shareMyStream()
    };

    const shareMyStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMyStream(stream);
            if (myVideoStream.current) {
                myVideoStream.current.srcObject = stream; // Set local stream  
            }
        } catch (error) {
            showToast(false, 'Unable to access camera and microphone. Please check your permissions.');
        }
    };

    const joinCall = () => {

        if (!myStream || !peerReceiverID) {
            showToast(false, 'Please share your video stream and enter a receiver ID.');
            return;
        }

        myPeer.call(peerReceiverID, myStream);

        if (myVideoStream.current) {
            myVideoStream.current.srcObject = myStream; // You need to set your own stream as well  
        }
    };

    return (
        <LeftBarContainer getBack={getBack} title="Video chat room">

            <section className="text-nowrap">

                <div className="flex w-full gap-3 flex-wrap items-center ch:flex-1 ch:bg-chatBg ch:rounded-md ch:p-3 ch:cursor-pointer">
                    <button onClick={shareMyStream} className="w-full flex-grow-1 flex-shrink-0">Share my screen</button>
                    <button onClick={() => copyText(myId)}>Copy My ID</button>
                    <div className="flex items-center justify-between">
                        <input onChange={e => setPeerReceiverID(e.target.value)} className="border-none outline-none bg-inherit" placeholder="Join Room" />
                        <p onClick={joinCall} className="cursor-pointer">Join</p>
                    </div>
                    <button onClick={toggleMyStream}>Toggle Stream</button>
                </div>

                <video muted autoPlay className="w-full px-2l rounded-md bg-chatBg mt-3" ref={myVideoStream}></video>
                <video autoPlay className="w-full px-2l rounded-md bg-chatBg mt-3" ref={userVideoStream}></video>

            </section>

        </LeftBarContainer>
    );
};

export default VideoChat;