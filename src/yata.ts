export type Id = string
export type Store = Map<Id, Item> & { pending: Map<Set<Id>, () => void> }

export interface Item {
  id: Id
  left?: Item
  right?: Item
  origin: Id
  rightOrigin: Id
  contents: string
  deleted?: true
}

export function gen_uid (debug = '') {
  return debug + '-' + Math.random().toString(36).slice(2, 6)
}

export const HEAD: Item = { id: gen_uid('head'), origin: '', rightOrigin: '', contents: '' }
export const store = /* @__PURE__ */ Object.assign(
  /* @__PURE__ */ new Map([[HEAD.id, HEAD]]), { pending: /* @__PURE__ */ new Map() }
)

export function insert (store: Store, id: Id, contents: string, origin: Id, rightOrigin: Id) {
  const item: Item = { id, origin: '', rightOrigin: '', contents }
  store.set(id, item)
  if ((origin && !store.has(origin)) || (rightOrigin && !store.has(rightOrigin))) {
    const depends = new Set<Id>([origin, rightOrigin].filter(e => e && !store.has(e)))
    store.pending.set(depends, () => insert(store, id, contents, origin, rightOrigin))
  } else {
    item.left = store.get(origin)
    item.right = store.get(rightOrigin)
    item.origin = origin
    item.rightOrigin = rightOrigin
    if ((!item.left && (!item.right || item.right.left)) ||
      (item.left && item.left.right !== item.right)) {
      let left = item.left
      let o = left?.right
      const conflicting = new Set<Item>()
      const all = new Set<Item>()
      while (o && o !== item.right) {
        all.add(o)
        conflicting.add(o)
        if (item.origin === o.origin) {
          if (o.id < item.id) {
            left = o
            conflicting.clear()
          } else if (item.rightOrigin === o.rightOrigin) {
            break
          }
        } else if (o.origin && all.has(store.get(o.origin) as Item)) {
          if (!conflicting.has(store.get(o.origin) as Item)) {
            left = o
            conflicting.clear()
          }
        } else {
          break
        }
        o = o.right
      }
      item.left = left
    }
    if (item.left) {
      const right = item.left.right
      item.right = right
      item.left.right = item
    }
    if (item.right) {
      item.right.left = item
    }
    if (store.pending) {
      for (const depends of store.pending.keys()) {
        depends.delete(id)
        if (depends.size === 0) {
          const action = store.pending.get(depends) as () => void
          store.pending.delete(depends)
          action()
        }
      }
    }
  }
}

export function remove (store: Store, id: Id) {
  const item = store.get(id)
  if (!item) {
    store.pending.set(new Set([id]), () => remove(store, id))
  } else {
    item.deleted = true
  }
}
