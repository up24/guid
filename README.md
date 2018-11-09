# guid

Lex sortable ids (byte-string also)

# Example

```js
import { guid } from '@up24/guid'

console.log(guid())

// -LQuTbybEufyGGcekO0w-k
```

# API

### guid.`guid()`

Generate new id

### guid.`bufferToGuid(bytes: Buffer)`

Convert Buffer object to lex sortable string

### guid.`guidToBuffer(str: string)`

Convert guid to Buffer
