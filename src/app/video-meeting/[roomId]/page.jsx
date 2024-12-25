"use client"
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ZegoSuperBoardManager } from "zego-superboard-web";

const VideoMeeting = () => {
  const params = useParams();
  const roomID = params.roomId;

  const { data: session, status } = useSession();
  const router = useRouter();
  const containerRef = useRef(null) // ref for video container element
  const [zp, setZp] = useState(null)
  const [isInMeeting, setIsInMeeting] = useState(false);


  //check ng dung dang nhap neu vao link cuoc hop
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.name && containerRef.current) {
      joinMeeting(containerRef.current)
    } 
    else {
      // toast.error('Please login before join meeting')
      router.push('/user-auth')
    }
  }, [session, status])



  useEffect(() => {
    return () => {
      if (zp) {
        zp.destroy()
      }
    }
  }, [zp])



  const joinMeeting = async (element) => {
    // generate Kit Token
    const appID = Number(process.env.NEXT_PUBLIC_ZEGOAPP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
    if (!appID && !serverSecret) {
      throw new Error('please provide appId and secret key')
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, session?.user?.id || Date.now().toString(), session?.user?.name || 'Guest');


    // Create instance object from Kit Token.
    const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
    if (!zegoInstance) {
      throw new Error('Failed to create Zego instance');
    }
    setZp(zegoInstance);

    // start the call
    zegoInstance.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Join via this link',
          url: `${window.location.origin}/video-meeting/${roomID}`
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTurnOffRemoteCameraButton: true,
      showTurnOffRemoteMicrophoneButton: true,
      showRemoveUserButton: true,
      whiteboardConfig: {
      },
      onJoinRoom: () => {
        toast.success('Meeting joined succesfully')
        setIsInMeeting(true);
      },
      onLeaveRoom: () => {
        endMeeting();
      },
    });
  };

  const endMeeting = () => {
    if (zp) {
      zp.destroy();
    }
    toast.success('Meeting end succesfully')
    setZp(null);
    setIsInMeeting(false)
    router.push('/')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className={`flex-grow flex flex-col md:flex-row relative ${isInMeeting ? "h-screen" : ""}`}>
        <div ref={containerRef} className="video-container flex-grow" style={{ height: isInMeeting ? "100%" : "calc(100vh - 4rem)" }}></div>
      </div>
    </div>
  );
}

export default VideoMeeting