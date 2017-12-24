# pact-manifest-cli

A Node.js CLI tool to generate a pact manifest file for existing pact contracts, and publish them to a broker based on a tag.


## Installation

```bash
yarn add pact-manifest-cli
```

## Usage

### Generate a pact manifest

```bash
$ cd backend-api/
$ pact-manifest-cli generate --pact-files-path "test/pacts/*.json" --manifest-file /tmp/pact-manifest.json
```

Command line options for `generate` option:

Option | Description | Example value
------------ | ------------- | -------------
`--base-path [base-path]` | A directory's base path for the pact files location. Defaults to current   working dir. | ~/backend-api
`--pact-files-path <pact-files-path>` | A directory relative to --base-path option, to find pact files` | `test/pacts/*.json`
`--manifest-file <manifest-file>` | The filename (or full path) to save the pact manifest file | `/tmp/pact-manifest.json`
`--pact-default-tag [pact-default-tag]` | The tag to assign by default to pact files when submitting them  to broker. Defaults to "develop". | `dev`


### Publish a pact manifest to a broker

```bash
$ cd backend-api/
$ pact-manifest-cli publish --manifest-file /tmp/pact-manifest.json --broker-base-url https://mycompany.pact.dius.com.au --broker-username user1 --broker-password password1 --consumer-app-version 1.0.0
```

Command line options for `generate` option:

Option | Description | Example value
------------ | ------------- | -------------
`--manifest-file <manifest-file>` | The manifest file to process | `/tmp/pact-manifest.json`
`--broker-base-url [broker-base-url]` | The base URL of the Pact Broker [url]. Defaults to "https://localhost". | 
`--broker-username [broker-username]` | Pact Broker basic auth username [username] | ``
`--broker-password [broker-password]` | Pact Broker basic auth password [password] | ``
`--consumer-app-version <consumer-app-version>` | The consumer application version | `1.0.1`
`--pact-tag [pact-tag]` | The tag of the pact files to publish. If omitted all the files will be published.` | `develop`

## Tests

Project tests:

```bash
yarn run test
```

Project linting:

```bash
yarn run lint
```

## Coverage

```bash
yarn run test:coverage
```

## Contributing

### Commit Guidelines

The project uses the commitizen tool for standardizing changelog style commit
messages so you should follow it as so:

```bash
git add .           # add files to staging
yarn run commit      # use the wizard for the commit message
```
