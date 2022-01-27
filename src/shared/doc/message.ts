export const enum MessageType {
  PING,
  CREATE,
  UPDATE,
  DELETE,
  CALL,
}

export interface Message {
  type: MessageType
}

export interface CreateMessage extends Message {
  type: MessageType.CREATE
  class: 'item' | 'counter' | 'list' | 'tree'
}

export interface UpdateMessage extends Message {
  type: MessageType.UPDATE
  args: { id: number, [props: string]: unknown }
}

export interface DeleteMessage extends Message {
  type: MessageType.DELETE
  id: number
}

export interface CallMessage extends Message {
  type: MessageType.CALL
  args: { id: number, method: string }
}
