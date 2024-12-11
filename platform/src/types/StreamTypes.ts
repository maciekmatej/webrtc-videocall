import type { MediaConnection } from 'peerjs'

export interface Stream {
  call?: MediaConnection
  stream?: MediaStream
  isAudioMuted: boolean
  isVideoMuted: boolean
}
