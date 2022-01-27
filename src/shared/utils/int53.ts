/**
 * @fileoverview 53-bit integer generator.
 */

import { cryptoRandomBuffer } from 'isomorphic.js'

export const INT32_MAX = 0xFFFFFFFF
export const INT21_MAX = 0x001FFFFF
const SHIFT_32 = 0x100000000

export function concat (client: number, clock: number) {
  return (client * SHIFT_32) + clock
}

export function split (raw: number): [client: number, clock: number] {
  const clock = raw & INT32_MAX
  const client = (raw - clock) / SHIFT_32
  return [client, clock]
}

export function validate (raw: number) {
  return raw >= 0 && Number.isSafeInteger(raw)
}

export const CLIENT = /* @__PURE__ */ (() => (
  new Uint32Array(cryptoRandomBuffer(4))[0] & INT21_MAX
))()

export let id = /* @__PURE__ */ concat(CLIENT, 1)

export function next_id () {
  return ++id
}

export function to_str (id: number) {
  const [client, clock] = split(id)
  return client.toString(36) + '-' + clock
}
