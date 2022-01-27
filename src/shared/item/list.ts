import type { Store } from './store'
import { next_id } from '../utils'
import { Item } from './item'

export class ListItem extends Item {
  left: number
  right: number

  constructor (id: number, left: number, right: number) {
    super(id)
    this.left = left
    this.right = right
  }

  static create (store: Store) {
    const id = next_id()
    const item = new ListItem(id, 0, 0)
    store.set(id, item)
    return item
  }

  // insert by item.left
  static insert (store: Store, item: ListItem) {
    const left = store.get(item.left)
    if (left === undefined || !(left instanceof ListItem)) {
      return false
    }

    left.right = item.id
    item.left = left.id

    const right = store.get(left.right)
    if (right !== undefined) {
      item.right = right.id

      if (right instanceof ListItem) {
        right.left = item.id
      }
    }
    return true
  }

  static remove (store: Store, item: ListItem) {
    const left = store.get(item.left)
    if (left === undefined || !(left instanceof ListItem)) {
      return false
    }

    left.right = item.right
    const right = store.get(item.right)
    if (right instanceof ListItem) {
      right.left = item.left
    }
    return true
  }
}
