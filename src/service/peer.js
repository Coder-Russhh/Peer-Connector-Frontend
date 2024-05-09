class Peer {
  constructor() {
      this.peer = new RTCPeerConnection({
          iceServers: [
              {
                  urls: [
                      "stun:stun.l.google.com:19302",
                      "stun:global.stun.twilio.com:3478",
                  ],
              },
          ],
      });
  }

  async getOffer() {
      try {
          const offer = await this.peer.createOffer();
          await this.peer.setLocalDescription(offer);
          return offer;
      } catch (error) {
          console.error("Error creating offer:", error);
          throw error;
      }
  }

  async getAnswer(offer) {
      try {
          await this.peer.setRemoteDescription(offer);
          const answer = await this.peer.createAnswer();
          await this.peer.setLocalDescription(answer);
          return answer;
      } catch (error) {
          console.error("Error creating answer:", error);
          throw error;
      }
  }

  async setLocalDescription(answer) {
      try {
          await this.peer.setRemoteDescription(answer);
      } catch (error) {
          console.error("Error setting local description:", error);
          throw error;
      }
  }
}

export default new Peer();
