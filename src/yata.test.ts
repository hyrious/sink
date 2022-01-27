import type { Item } from './yata'
import { gen_uid, HEAD, insert, remove, store } from './yata'

const id1 = gen_uid('hello') // hello,
const id2 = gen_uid('world') // world!
const id3 = gen_uid('goodbye') // goodbye

const actions = [
  () => insert(store, id2, 'world!', id1, ''),
  () => insert(store, id1, 'Hello, ', HEAD.id, ''),
  () => remove(store, id1),
  () => insert(store, id3, 'Goodbye, ', HEAD.id, id2),
]

function rand (n: number) {
  return Math.floor(Math.random() * n)
}

actions.sort(() => rand(3) - 1).forEach(action => {
  console.log(action.toString()); action()
})

// actions.forEach(action => {
//   console.log(action.toString()); action()
// })

const out = []
for (let p: Item | undefined = HEAD; p; p = p.right) {
  if (p.deleted) {
    out.push(`deleted(${JSON.stringify(p.contents)})`)
  } else {
    out.push(JSON.stringify(p.contents))
  }
}
console.log(out.join(' <=> '))
