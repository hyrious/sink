import type { Item } from './item'

export class Store {
  readonly items: Map<number, Item>

  constructor () {
    this.items = new Map()
  }

  set (id: number, item: Item) {
    this.items.set(id, item)
  }

  get<T extends Item> (id: number) {
    return this.items.get(id) as T | undefined
  }
}
