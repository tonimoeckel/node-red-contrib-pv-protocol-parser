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
npm install @tonimoeckel/node-red-pv-protocol-parser
```

## Usage

```javascript
//Input
const message = {
    payload: "1231030906000633037", //Response from serial path
    request_payload: "1230030902=?112", //Default request key from serial path
    request: "", //Custom request key (opt.)
}
``` 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
