CRDT 是一系列实现了同步的数据结构，\
数据结构是一些形状 `interface (without method)` 和相关的操作算法 `function`，\
例如 Yjs 总结出了一个双链表形状上的同步插入删除算法。

客户端发送和接收的是操作 `operation`，每个操作带有 `[client, clock]` 用于排序，\
通常来说，操作的目标是 CRDT 里的形状，为了准确标识目标，目标本身也有唯一 ID。

因此我们的抽象大概如下：

```ts
// 一个同步的对象
interface Item {
  id: Identifier // 标记对象的唯一，通常是随机生成的
                 // Yjs 里让这个字段直接是 client + clock，从而降低了很多内存消耗
}

// 一个同步的计数器，操作：inc, dec
interface AtomItem extends Item {
  value: number
}

// 一个同步的双链表节点，操作：insert, remove
interface ListItem extends Item {
  left: Identifier
  right: Identifier
  origin: Identifier      // 目标插入的位置，通常 <= left，用来进行冲突处理
  originRight: Identifier // 同上
}

// 一个同步的有序树节点，操作：insert, remove
interface TreeItem extends Item {
  parent: Identifier
  fraction:
    [num: number, denom: number] // 基于 evanw 描述的浅树排序算法
                                 // 虽然他是在服务器上解决的冲突，但是客户端（已知操作顺序时）也可以实现
}
```

```ts
// 一次广播的操作
interface Operation {
  id: [client: number, clock: number] // 用于操作排序
  method: string // 是的，就是 RPC，不过这里只保证 method 会调用，不会保证调用的顺序
  args: any[]
}

interface OpNew extends Operation {
  method: 'new'
  args: [item: Item]
}

interface OpDel extends Operation {
  method: 'del'
  args: [id: Identifier]
}

interface OpInc extends Operation {
  method: 'inc'
  args: [id: Identifier, amount: number]
}

interface OpInsert extends Operation {
  method: 'list-insert'
  args: [id: Identifier, origin: Identifier, originRight: Identifier]
}

interface OpRemove extends Operation {
  method: 'list-remove'
  args: [id: Identifier]
}

interface OpAttach extends Operation {
  method: 'tree-attach'
  args: [id: Identifier, parent: Identifier, fraction: [num: number, denom: number]]
}

interface OpDetach extends Operation {
  method: 'tree-Detach'
  args: [id: Identifier]
}
```
