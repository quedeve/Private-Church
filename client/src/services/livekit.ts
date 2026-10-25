import { Room, RoomEvent } from 'livekit-client';

class LiveKitVoiceService {
  private room: Room | null = null;
  private wsUrl: string;

  constructor() {
    this.wsUrl = import.meta.env.VITE_LIVEKIT_WS_URL || 'wss://demo.livekit.cloud';
  }

  public async connectToConfessionVoice(
    token: string,
    onParticipantConnected?: (id: string) => void,
    onParticipantDisconnected?: (id: string) => void
  ): Promise<boolean> {
    try {
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.room
        .on(RoomEvent.ParticipantConnected, (p) => {
          console.log('[LiveKit] Participant connected to voice:', p.identity);
          if (onParticipantConnected) onParticipantConnected(p.identity);
        })
        .on(RoomEvent.ParticipantDisconnected, (p) => {
          console.log('[LiveKit] Participant disconnected from voice:', p.identity);
          if (onParticipantDisconnected) onParticipantDisconnected(p.identity);
        });

      await this.room.connect(this.wsUrl, token);
      console.log('[LiveKit] Connected to voice room successfully');

      // Publish local audio track (audio only, no camera)
      await this.room.localParticipant.setMicrophoneEnabled(true);
      return true;
    } catch (err) {
      console.warn('[LiveKit] Voice connection failed or credentials unconfigured (running in simulated voice mode):', err);
      return false;
    }
  }

  public setMicrophoneMute(muted: boolean) {
    if (this.room) {
      this.room.localParticipant.setMicrophoneEnabled(!muted);
    }
  }

  public disconnect() {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
      console.log('[LiveKit] Disconnected from voice session');
    }
  }
}

export const liveKitService = new LiveKitVoiceService();
