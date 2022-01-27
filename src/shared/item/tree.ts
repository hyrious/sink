import type { Store } from './store'
import { Item } from './item'
import { next_id } from '..'

export const FRAC_BASE = 10
const RIGHT_BOUND = { frac: 1, base: 1 } as TreeItem

export class TreeItem extends Item {
  parent: number
  frac: number
  base: number
  readonly children!: TreeItem[]

  constructor (id: number, parent: number, frac: number, base: number) {
    super(id)
    this.parent = parent
    this.frac = frac
    this.base = base
    // to hide the children prop when JSON.stringify()
    Object.defineProperty(this, 'children', { value: [], enumerable: false })
  }

  static create (store: Store) {
    const id = next_id()
    const item = new TreeItem(id, 0, 0, 0)
    store.set(id, item)
    return item
  }

  // insert by item.parent
  static insert (store: Store, item: TreeItem) {
    const parent = store.get(item.parent)
    if (parent === undefined || !(parent instanceof TreeItem)) {
      return false
    }

    const index = this.resolve_conflict(item, parent)
    parent.children.splice(index, 0, item)
    return true
  }

  static remove (store: Store, item: TreeItem) {
    const parent = store.get(item.parent)
    if (parent instanceof TreeItem) {
      const index = parent.children.indexOf(item)
      if (index === -1) {
        throw new Error('Unexpected case')
      }
      parent.children.splice(index, 1)
    }
  }

  static resolve_conflict (item: TreeItem, parent: TreeItem) {
    const conflicting = this.binary_search(parent, item)
    if (conflicting === undefined) {
      return parent.children.length
    }

    const [index, left, right] = conflicting
    // test if we can just increase the frac part to make it unique
    if (right !== RIGHT_BOUND && (left.frac + 1) / left.base === right.frac / right.base) {
      item.frac = left.frac + 1
      item.base = left.base
    } else {
      // otherwise, we multiply the FRAC_BASE to make it bigger
      item.frac = (left.frac * FRAC_BASE) + 1
      item.base = (left.base * FRAC_BASE)
      // TODO: will the number overflow?
    }
    return index
  }

  static binary_search ({ children }: TreeItem, item: TreeItem):
  [index: number, left: TreeItem, right: TreeItem] | undefined {
    let [left, right] = [0, children.length - 1]
    let mid = children[right]
    if (this.is_frac_equal(item, mid)) {
      return [right, mid, RIGHT_BOUND]
    }
    let index = Math.floor((left + right) / 2)
    while (left <= right) {
      mid = children[index]
      if (this.is_frac_equal(item, mid)) {
        return [index, mid, children[index + 1]]
      } else if (this.is_frac_less(item, mid)) {
        right = index - 1
      } else {
        left = index + 1
      }
      index = Math.floor((left + right) / 2)
    }
    return undefined
  }

  static is_frac_equal (a: TreeItem, b: TreeItem) {
    return a.frac / a.base === b.frac / b.base
  }

  static is_frac_less (a: TreeItem, b: TreeItem) {
    return a.frac / a.base < b.frac / b.base
  }
}
