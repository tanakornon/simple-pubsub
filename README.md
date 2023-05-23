### Start

install package / node_modules

```
npm install
```

entrypoint of the project ./src/app.ts

```
npm run start
```

### Test

```
npm run test
```

```
 PASS  tests/Events.test.ts
  Events
    √ should handle MachineRefillEvent and increase the stock level (1 ms)
    √ should handle MachineSaleEvent and decrease the stock level
    √ should fire LowStockWarningEvent when stock level drops below 3 (18 ms)
    √ should fire StockLevelOkEvent when stock level hits 3 or above (2 ms)
    √ should fire LowStockWarningEvent only once when crossing the threshold (11 ms)
    √ should fire StockLevelOkEvent only once when crossing the threshold (2 ms)

 PASS  tests/PublishSubscribeService.test.ts
  PublishSubscribeService
    √ should notify subscribers when publishing an event (2 ms)
    √ should not notify unsubscribed subscribers when publishing an event
    √ should unsubscribe subscribers from receiving events
```

### Test Coverage

```
npm run test:coverage
```

```
All files                    |   96.73 |       80 |     100 |   96.73 |
 events                      |     100 |      100 |     100 |     100 |
  LowStockWarningEvent.ts    |     100 |      100 |     100 |     100 |
  MachineRefillEvent.ts      |     100 |      100 |     100 |     100 |
  MachineSaleEvent.ts        |     100 |      100 |     100 |     100 |
  StockLevelOkEvent.ts       |     100 |      100 |     100 |     100 |
 models                      |     100 |      100 |     100 |     100 |
  Machine.ts                 |     100 |      100 |     100 |     100 |
 services                    |     100 |      100 |     100 |     100 |
  PublishSubscribeService.ts |     100 |      100 |     100 |     100 |
 subscribers                 |   94.33 |    72.72 |     100 |   94.33 |
  MachineRefillSubscriber.ts |   94.44 |       75 |     100 |   94.44 | 23
  MachineSaleSubscriber.ts   |     100 |      100 |     100 |     100 |
  StockLevelOkSubscriber.ts  |   85.71 |        0 |     100 |   85.71 | 18
  StockWarningSubscriber.ts  |   85.71 |        0 |     100 |   85.71 | 18
-----------------------------|---------|----------|---------|---------|-------------------
```
