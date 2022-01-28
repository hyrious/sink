// eslint-disable-next-line max-len
// heavily based on that paper: https://www.researchgate.net/publication/310212186_Near_Real-Time_Peer-to-Peer_Shared_Editing_on_Extensible_Data_Types
// also see: https://github.com/josephg/reference-crdts

// Each user has an unique ID.
export type UserId = string

// Each user gets an operation counter which gets incremented
// every time a user creates an operation.
export type Clock = number

// Each operation has an unique identifier (userId, clock).
// In YATA we have two operations running on a linked list: insert & delete.
// An insert operation has:
// (userId, clock) - the identifier
// origin          - where it want to be inserted after
// (left, right)   - where it is really inserted between
// content         - the content, e.g. a character
// isDeleted       - a boolean indicating if this operation is deleted
export interface Operation {
  userId: UserId
  clock: Clock
  origin: [UserId, Clock] | null // optimize: add `originRight` to narrow down the searching range
  content: string
  isDeleted: boolean
}

// Compare operations, figure out which is the left.
function compareOpWithId (op: Operation, origin: [UserId, Clock] | null) {
  if (origin === null) {
    return 1 // always insert to the begin
  } else if (op.userId === origin[0] && op.clock === origin[1]) {
    return 0
  } else if (op.userId === origin[0] && op.clock < origin[1]) {
    return -1
  } else {
    return op.userId.localeCompare(origin[0])
  }
}

// Slow search
// optimize: use struct-store and binary search to find the operation faster
function find_origin (origin: [UserId, Clock], doc: Operation[]) {
  const exact = doc.findIndex(e => e.userId === origin[0] && e.clock === origin[1])
  if (exact !== -1) {
    return exact
  }
  return Math.max(doc.findIndex(e => compareOpWithId(e, origin) >= 0) - 1, -1)
}

function compareIdWithId (id1: [UserId, Clock] | null, id2: [UserId, Clock] | null) {
  if (id2 === null) {
    return id1 === null ? 0 : -1
  } else if (id1 === null) {
    return 1
  } else if (id1[0] === id2[0]) {
    return id1[1] - id2[1]
  } else {
    return id1[0].localeCompare(id2[0])
  }
}

// Insert `i` in a list of conflicting operations `doc`.
export function insert (i: Operation, doc: Operation[]) {
  let index = i.origin ? find_origin(i.origin, doc) : -1
  // `i` want to insert at `left`.
  let left = index
  // Searching from `index` to the end of the list, resolve conflicts
  for (; index >= 0 && index < doc.length; ++index) {
    const o = doc[index]
    // Rule 2: Search for the last operation that is to the left of `i`.
    if (
      (compareOpWithId(o, i.origin) < 0 || compareIdWithId(i.origin, o.origin) <= 0) &&
      (compareIdWithId(o.origin, i.origin) !== 0 || o.userId.localeCompare(i.userId) < 0)
    ) {
      // Rule 1 and 3: If this formula is fulfilled, `i` is to the right of `o`.
      left = index
    } else if (compareIdWithId(i.origin, o.origin) > 0) {
      // Breaking condition, Rule 1 is no longer satisfied.
      break
    }
  }
  // Insert `i` at `left`.
  doc.splice(left + 1, 0, i)
}

export function remove (i: Operation) {
  i.isDeleted = true
}
