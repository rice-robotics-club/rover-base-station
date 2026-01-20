import { useEffect, useRef } from "react";

function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const pc1 = new RTCPeerConnection();
    const pc2 = new RTCPeerConnection();
    let stream: MediaStream;

    // ICE candidate exchange
    pc1.onicecandidate = e => e.candidate && pc2.addIceCandidate(e.candidate);
    pc2.onicecandidate = e => e.candidate && pc1.addIceCandidate(e.candidate);

    // When pc2 receives the remote track, set it on the video element
    pc2.ontrack = e => {
      if (videoRef.current) {
        videoRef.current.srcObject = e.streams[0];
      }
    };

    // Get webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(async s => {
        stream = s;

        // Add webcam track to pc1
        stream.getTracks().forEach(track => pc1.addTrack(track, stream));

        // Create offer AFTER adding track
        const offer = await pc1.createOffer();
        await pc1.setLocalDescription(offer);
        await pc2.setRemoteDescription(offer);

        // Create answer
        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        await pc1.setRemoteDescription(answer);
      })
      .catch(err => console.error("Error accessing webcam:", err));

    // Cleanup on unmount
    return () => {
      stream?.getTracks().forEach(t => t.stop());
      pc1.close();
      pc2.close();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ width: 640, height: 480, background: "black" }}
    />
  );
}

export default Video;
