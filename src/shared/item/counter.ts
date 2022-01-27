import type { Store } from './store'
import { next_id } from '../utils'
import { Item } from './item'

export class CounterItem extends Item {
  value: number

  constructor (id: number, value: number) {
    super(id)
    this.value = value
  }

  inc (amount: number) {
    this.value += amount
  }

  dec (amount: number) {
    this.inc(-amount)
  }

  static create (store: Store) {
    const id = next_id()
    const item = new CounterItem(id, 0)
    store.set(id, item)
    return item
  }
}
