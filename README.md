# moment-range-alias


# How to use

## Setup

```js
import { thisOperationFactory } from 'moment-range-alias/dist/operations';

const thisOperation = thisOperationFactory();
/// Or with a custom date to compare with
const thisOperation = thisOperationFactory(moment('2018-01-05'));

const rangeAlias = new RangeAlias()
    .setOperations(thisOperation)
```

## getAlias()

Retrieve the alias of a range

```js
// Compare date: 2018-01-05

const range = moment.range(
    moment('2018-01-01'),
    moment('2018-01-06')
);

rangeAlias.getAlias(range); // returns 'tw'
```

## getRange()

Retrieve a range based on an alias

```js
// Get the range of "t(his) w(eek)"
rangeAlias.getRange('tw');

// Get the range of "t(his) M(onth)"
rangeAlias.getRange('tM');

// Get the range of "t(his) y(ear)"
rangeAlias.getRange('ty');
```


## getAvailableAliases()

Retrieve all possible aliases within a range

```js
const range = moment.range(null, null); // Infinite
const range = moment.range(moment()); // start date
const range = moment.range(null, moment()); // end date
const range = moment.range(moment().startOf('month'), moment()); // start + end date

// Returns array of possible aliases
rangeAlias.getAvailableAliases(range); // ['lM', 'tM', 'lw', 'tw']
```
