# skill-testing-ml (maintained fork)

A YAML-based testing framework for Alexa skills. Write tests declaratively, run them with Jest.

## Why this fork?

The [original `skill-testing-ml`](https://github.com/bespoken/skill-testing-ml) by Bespoken is **discontinued and archived**. It ships Jest 24 and several outdated dependencies with known vulnerabilities, making it incompatible with modern Node.js toolchains.

This fork maintains compatibility with **current dependencies**:

| Dependency | Original | This fork |
|------------|----------|-----------|
| jest | ^24.7.1 | ^29.7.0 |
| jest-message-util | ^24.7.1 | ^29.7.0 |
| lodash | ^4.17.11 | ^4.17.21 |
| uuid | ^3.3.3 | ^11.0.0 |
| chalk | ^2.4.2 | ^4.1.2 |
| Node.js | >=12 | >=18 |

Removed unused dependencies: `virtual-device-sdk`, `virtual-google-assistant`.

## Installation

```bash
npm install github:planadecu/skill-testing-ml
```

This replaces `bespoken-tools` — you no longer need `bst test`. Use `skill-tester` directly.

## Usage

Create a `testing.json` in your project root:

```json
{
  "handler": "./src/index.js",
  "runInBand": true
}
```

Write tests in YAML:

```yaml
---
- test: "Launch request"
- LaunchRequest:
  - response.outputSpeech.ssml: "Here's your fact"
  - response.card.type: "Simple"
  - response.card.title: "Space Facts"
  - response.card.content: "/.*/"
```

Run:

```bash
npx skill-tester
```

## Features

- Multi-turn conversations
- Dialog Interface support
- AudioPlayer interface support
- Entity resolution
- Explicit intent and slot setting
- Wildcard support for non-regex expressions
- Support for setting address and permissions
- Explicit SessionEndedRequest
- Support for goto and flow control
- Support for testing DynamoDB
- Callbacks for filtering payloads programmatically

## Documentation

- [Getting started guide](https://read.bespoken.io/unit-testing/getting-started/)
- [Common use-cases](https://read.bespoken.io/unit-testing/use-cases/)
- [Full specification](https://docs.google.com/document/d/17GOv1yVAKY4vmOd1Vhg_IitpyCMiX-e_b09eufNysYI/edit)

## Contributing

PRs are welcome. The goal is to keep this fork working with modern Node.js and up-to-date dependencies, not to add new features. If you find a compatibility issue, please open an issue or submit a fix.

## License

ISC (see [LICENSE](LICENSE))
