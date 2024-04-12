# Monsters - fights

## 1. How to start

### Install dependencies

```shell
npm install / yarn
```

## 2. How to build

```shell
npm run build / yarn build
```

If you even encounter strange build behavior, tsconfig is set to create build with cache. Set option `incremental` in
tsConfig to false

## 3. Useful information

### 3.1 Logs folder

#### Linux

```text
~/.cache/"package.json -> productName"/logs
```

#### Windows

```text
~/AppData/Roaming/"package.json -> productName"/logs
```

### 3.2 Testing

#### All test currently are written using jest. You can run all tests or just type specific tests

#### Available targets

```text
yarn tests = run all tests
yarn tests:e2e = run 'end to end' tests
yarn tests:db = run 'database' tests
yarn tests:unit = run 'unit' tests
yarn test:watch = run tests in 'watch' mode
```
