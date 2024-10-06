import { ElementType, useRef } from "react";
import LeftBarContainer from "./LeftBarContainer"
import Peer from 'peerjs'
let myPeer;

const VideoChat = ({ getBack }: { getBack: () => void }) => {

    const myVideoStream = useRef<ElementType<'video'>>(null)
    const userVideoStream = useRef(null)

    const shareMyStream = () => {
        myPeer = new Peer();

        myPeer.on('open', async id => {
            console.log('my peer id: ', id);

            try {
                const myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                
            } catch (error) {
                console.error('Error accessing media devices.', error);
                alert('Unable to access camera and microphone. Please check your permissions.');
            }
        });

        myPeer.on('error', (err) => {
            console.error('PeerJS error:', err);
        });
    };


    return (
        <LeftBarContainer getBack={getBack} title="Video chat room">

            <section className="">


                <div className="flex w-full gap-3 flex-wrap items-center ch:flex-1 ch:bg-chatBg ch:rounded-md ch:p-3 ch:cursor-pointer">

                    <button onClick={shareMyStream} className="w-full flex-grow-1 flex-shrink-0">Share my screen</button>

                    <button>copyMyID</button>

                    <div className="flex items-center justify-between">
                        <input className="border-none outline-none bg-inherit" placeholder="joinRoom" />
                        <p className="cursor-pointer">Join</p>
                    </div>

                </div>

                <video muted className="w-full px-2l rounded-md aspect-video bg-chatBg mt-3" id="myVideo" ref={myVideoStream as any}></video>

                <video className="w-full px-2l rounded-md aspect-video bg-chatBg mt-3" ref={userVideoStream as any}></video>


            </section>

        </LeftBarContainer>
    )
}

export default VideoChat