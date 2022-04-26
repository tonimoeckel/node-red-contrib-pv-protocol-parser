# Pfeiffer Vacuum Protocol Parser

NodeJS lib for parsing serial responses from multiple Pfeiffer Vacuum products.

This lib currently supports:
- Pfeiffer Vacuum Protocol (RS485)
- MAGPOWER (ATH)
- Dry pumps (M4, M6)

Coming up:
- ASM Leak Detectors

## Installation

```bash
npm install pv-protocol-parser
```

## Usage

```javascript
const {PVProtocolParser} = require("pv-protocol-parser");

console.log(PVProtocolParser.parseResponse("1231030906000633037", {
    request: "1230030902=?112\r"
}))
// Outputs: { ActualSpd: 633 }

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
