import type { Store } from './store'
import { next_id } from '../utils'

export class Item {
  readonly id: number
  [prop: string]: unknown // last-write-wins

  constructor (id: number) {
    this.id = id
  }

  static create (store: Store) {
    const id = next_id()
    const item = new Item(id)
    store.set(id, item)
    return item
  }
}
