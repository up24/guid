import * as crypto from 'crypto'

const GUID_SIZE = 16
const TIME_SIZE = 6 // 10889 year
const RANDOM_SIZE = GUID_SIZE - TIME_SIZE
const RANDOM_OFFSET = TIME_SIZE
const SEQUENCE_SIZE = 4 // ~100k guids/ms (avg worst)
const SEQUENCE_END = TIME_SIZE + SEQUENCE_SIZE - 1
const B64_LENGTH = Math.ceil(GUID_SIZE * 8 / 6)

let cachedGuid: Buffer
let cachedTime: number

function sameMsGuid () {
  for (let idx = SEQUENCE_END; idx >= TIME_SIZE; idx--) {
    if (cachedGuid[idx] === 0xFF) {
      cachedGuid[idx] = 0x00
    } else {
      ++cachedGuid[idx]
      return
    }
  }

  throw new Error('GUID Sequence overflow')
}

function nextMsGuid () {
  const guid = Buffer.allocUnsafe(GUID_SIZE)

  guid.writeUIntBE(cachedTime, 0, TIME_SIZE)

  const random = crypto.randomBytes(RANDOM_SIZE)
  random.copy(guid, RANDOM_OFFSET)

  cachedGuid = guid
}

export function guid () {
  const nowTime = Date.now()

  if (nowTime !== cachedTime) {
    cachedTime = nowTime
    nextMsGuid()
  } else {
    sameMsGuid()
  }

  return bufferToGuid(cachedGuid)
}

export function bufferToGuid (bytes: Buffer) {
  return bytes
    .toString('base64')
    .replace('+', '-')
    .replace('/', '_')
    .substr(0, B64_LENGTH)
}

export function guidToBuffer (str: string) {
  return Buffer.from(str, 'base64')
}
