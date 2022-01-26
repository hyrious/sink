export class Item {
  id: number

  constructor (id: number) {
    this.id = id
  }
}

export type Store = Map<number, Item>

export class CounterItem extends Item {
  value: number

  constructor (id: number, value: number) {
    super(id)
    this.value = value
  }

  inc () {
    this.value++
  }

  dec () {
    this.value--
  }
}

export const FRAC_BASE = 10

export class TreeItem extends Item {
  parent: number
  frac: number
  base: number
  children: TreeItem[] // no track

  constructor (id: number, parent: number, frac: number, base: number) {
    super(id)
    this.parent = parent
    this.frac = frac
    this.base = base
    this.children = []
  }

  static resolve_conflict (store: Store, item: TreeItem) {
    const parent = store.get(item.parent)
    if (parent === undefined || !(parent instanceof TreeItem)) {
      return false
    }

    const conflict_items = this.binary_search(parent, item)
    if (conflict_items === undefined) {
      return false
    }

    const [left, right] = conflict_items
    if ((left.frac + 1) / left.base === right.frac / right.base) {
      item.frac = left.frac + 1
      return true
    } else {
      item.frac = (item.frac * FRAC_BASE) + 1
      item.base = (item.base * FRAC_BASE)
      return true
    }
  }

  static binary_search ({ children }: TreeItem, item: TreeItem):
  [left: TreeItem, right: TreeItem] | undefined {
    let [left, right] = [0, children.length - 1]
    let mid = children[right]
    if (this.is_frac_equal(item, mid)) {
      // item is parent.right_most_child, should never happen
      throw new Error('Unexpected case')
    }
    let index = Math.floor((left + right) / 2)
    while (left <= right) {
      mid = children[index]
      if (this.is_frac_equal(item, mid)) {
        return [mid, children[index + 1]]
      } else if (this.is_frac_less(item, mid)) {
        right = index - 1
      } else {
        left = index + 1
      }
      index = Math.floor((left + right) / 2)
    }
    // not found
    return undefined
  }

  static is_frac_equal (a: TreeItem, b: TreeItem) {
    return a.frac / a.base === b.frac / b.base
  }

  static is_frac_less (a: TreeItem, b: TreeItem) {
    return a.frac / a.base < b.frac / b.base
  }
}

export class ListItem extends Item {
  left: number
  right: number

  constructor (id: number, left: number, right: number) {
    super(id)
    this.left = left
    this.right = right
  }

  static is_head (item: ListItem) {
    return item.left === 0
  }

  static is_tail (item: ListItem) {
    return item.right === 0
  }
}
