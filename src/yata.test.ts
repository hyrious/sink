import type { Clock, Operation, UserId } from './yata'
import { insert, remove } from './yata'

let doc: Operation[] = []
const rand = (n: number) => (Math.random() * n) | 0
const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = rand(i + 1)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
const print = () => doc
  .filter(e => !e.isDeleted)
  .map(({ userId, clock, content }) => `[${userId}:${clock} ${JSON.stringify(content)}]`).join('')
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const op_to_origin = (op: Operation): [UserId, Clock] => [op.userId, op.clock]

class User {
  clock: number

  constructor (readonly userId: string) {
    this.clock = 1
  }

  makeInsertOp (content: string, origin: [UserId, Clock] | null): Operation {
    return {
      userId: this.userId,
      clock: this.clock++,
      origin,
      content,
      isDeleted: false,
    }
  }

  insert (i: Operation) {
    console.log(`>> ${this.userId} insert ${i.content} at ${i.origin}`, print())
    insert(i, doc)
    console.log('=>', print())
  }

  delete (i: Operation) {
    console.log(`>> ${this.userId} delete ${i.content}`, print())
    remove(i)
    console.log('=>', print())
  }
}

const users = Array.from({ length: 3 }, (_, i) => new User(`user${i + 1}`))
const rand_op = () => {
  const user = users[rand(users.length)]
  if (doc.length && rand(2)) {
    const i = doc[rand(doc.length)]
    return () => user.delete(i)
  } else {
    const content = alphabet[rand(alphabet.length)].repeat(rand(10) + 1)
    const origin = doc.length ? op_to_origin(doc[rand(doc.length)]) : null
    const i = user.makeInsertOp(content, origin)
    return () => user.insert(i)
  }
}

const ops = Array.from({ length: 5 }, () => {
  const op = rand_op()
  op() // apply it once
  return op
})
console.log('\nexpect', print(), '\n')

doc = []
shuffle(ops).forEach(op => op())
console.log('\nactual', print())
