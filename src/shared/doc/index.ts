/**
 * @fileoverview Each doc is a complete representation of the app model.
 */

import type { Channel } from '../utils'
import type { Message } from './message'
import { Store } from '../item'
import { MessageType } from './message'

export abstract class Doc {
  readonly store: Store
  readonly channel: Channel

  constructor (channel: Channel) {
    this.store = new Store()
    this.channel = channel

    this.channel.addEventListener('message', this.on_message)
  }

  on_message = (data: string | ArrayBuffer) => {
    if (data instanceof ArrayBuffer) {
      throw new Error('Unexpected case')
    }
    const msg = JSON.parse(data)
    this[(msg as Message).type](msg)
  }

  remove () {
    this.channel.removeEventListener('message', this.on_message)
  }

  ping () {
    this.channel.send(JSON.stringify({ type: MessageType.PING }))
  }

  abstract [MessageType.PING] (_msg: Message): void
  abstract [MessageType.CREATE] (_msg: Message): void
  abstract [MessageType.UPDATE] (_msg: Message): void
  abstract [MessageType.DELETE] (_msg: Message): void
  abstract [MessageType.CALL] (_msg: Message): void
}
