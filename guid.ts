let crypto = require('crypto')

const GUID_SIZE = 16
const TIME_SIZE = 6 // 10889 year
const RANDOM_SIZE = GUID_SIZE - TIME_SIZE
const RANDOM_OFFSET = TIME_SIZE
const SEQUENCE_SIZE = 4 // ~100k guids/ms (avg worst)
const SEQUENCE_END = TIME_SIZE + SEQUENCE_SIZE - 1
const B64_LENGTH = Math.ceil(GUID_SIZE * 8 / 6)

let cached_guid = null
let cached_time = 0

function sameMsGuid () {
  for(let idx = SEQUENCE_END; idx >= TIME_SIZE; idx--) {
    if (cached_guid[idx] === 0xFF) {
      cached_guid[idx] = 0x00
    } else {
      ++cached_guid[idx]
      return
    }
  }

  throw new Error('GUID Sequence overflow')
}

function nextMsGuid () {
  let guid = new Buffer(16)

  guid.writeUIntBE(cached_time, 0, TIME_SIZE)

  let random = crypto.randomBytes(RANDOM_SIZE)
  random.copy(guid, RANDOM_OFFSET)

  cached_guid = guid
}

function guid () {
  let now_time = Date.now()

  if (now_time != cached_time) {
    cached_time = now_time
    nextMsGuid()
  } else {
    sameMsGuid()
  }

  return base64_encode(cached_guid)
}

function base64_encode (bytes) {
  return bytes
    .toString('base64')
    .replace('+', '-')
    .replace('/', '_')
    .substr(0, B64_LENGTH)
}

function base64_decode (str) {
  return Buffer.from(str, 'base64')
}
