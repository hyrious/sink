/**
 * @fileoverview Basically websocket, but should be implemented in each side.
 */

export interface Channel {

  CONNECTING: 0
  OPEN: 1
  CLOSING: 2
  CLOSED: 3

  readyState: 0 | 1 | 2 | 3

  open(): void
  send(data: string | ArrayBuffer): void
  close(reason: string): void

  addEventListener(type: 'open', listener: () => void): void
  addEventListener(type: 'close', listener: () => void): void
  addEventListener(type: 'error', listener: (reason: Error) => void): void
  addEventListener(type: 'message', listener: (data: string | ArrayBuffer) => void): void
  removeEventListener(
    type: 'open' | 'close' | 'error' | 'message',
    listener:
      | (() => void)
      | ((reason: Error) => void)
      | ((data: string | ArrayBuffer) => void)
    ): void

}
