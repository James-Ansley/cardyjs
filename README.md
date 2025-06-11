# @james-ansley/cardy

[![Repository](https://img.shields.io/badge/james--ansley%2Fcardyjs-102335?logo=codeberg&labelColor=07121A)](https://codeberg.org/james-ansley/cardyjs)
[![License](https://img.shields.io/badge/Apache--2.0-green?label=license)](https://codeberg.org/james-ansley/cardyjs/src/branch/main/LICENSE)
[![JSR](https://jsr.io/badges/@james-ansley/cardy)](https://jsr.io/@james-ansley/cardy)

Low-level card sorting utilities to compare card sorts — including calculating
edit distances, d-neighbourhoods, d-cliques, and orthogonality of card sorts.

It is recommended to read
[Deibel et al. (2005)](https://doi.org/10.1111/j.1468-0394.2005.00304.x)[^1]
and
[Fossum & Haller (2005)](https://doi.org/10.1111/j.1468-0394.2005.00305.x)[^2]
to familiarize yourself with the metrics covered in this library. In fact, that
entire special issue of Expert Systems is excellent reading for anyone
interested in analysing card sorting data.

## Install

```
deno add jsr:@james-ansley/cardy
```

<details>
<summary>Other Install Options</summary>

```bash
npx jsr add @james-ansley/cardy
```

```bash
bunx jsr add @james-ansley/cardy
```

```bash
pnpm i jsr:@james-ansley/cardy
```

```bash
yarn add jsr:@james-ansley/cardy
```

```bash
vlt install jsr:@james-ansley/cardy
```

</details>

## Usage

Card sorts are represented as arrays of sets of cards: `Set<T>[]` where each set
represents a group.

### Edit Distance

The edit distance between two sorts can be computed with the distance function:

```javascript
import {distance} from "@james-ansley/cardy";

const sort1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((e) => new Set(e));
const sort2 = [[1, 2], [3, 4], [5, 6, 7], [8, 9]].map((e) => new Set(e));

const dist = distance(sort1, sort2);
console.log("Distance:", dist);  // Distance: 3
```

When comparing sorts for equality, assert an edit distance of zero:

```javascript
if (distance(sort1, sort2) === 0) {
    // ...
}
```

#### Maximum and Normalised Edit Distances

Normalised edit distances can be computed with the `normDistance` function:

```javascript
import {normDistance} from "@james-ansley/cardy";

const sort1 = [
    ["a1", "a2", "a3"],
    ["b1", "b2", "b3", "b4", "b5"],
    ["c1", "c2", "c3", "c4", "c5"],
    ["d1", "d2", "d3", "d4"],
].map((e) => new Set(e));
const sort2 = [
    ["a1", "b1", "b5", "c1", "c5", "d1"],
    ["a2", "b2", "c2", "d2"],
    ["a3", "b3", "c3", "d3"],
    ["b4", "c4", "d4"],
].map((e) => new Set(e));

console.log(normDistance(sort1, sort2));  // 0.92...
console.log(normDistance(sort1, sort2, {numGroups: 4}));  // 1
```

The `numGroups` option specifies the normalised distance should be computed
under the assumption the maximum number of groups in either card sort will not
exceed `numGroups`. If this option is not given, distances are normalised with
no limit on the number of groups.

The maximum edit distance any other card sort can be from a given card sort can
be computed with the `maxDistance` function.

```javascript
import {maxDistance} from "@james-ansley/cardy";

// Using sort1 from the previous example
console.log(maxDistance(sort1));  // 13
console.log(maxDistance(sort1, {numGroups: 4}));  // 12
```

As before, the `numGroups` option places a restriction on the maximum number of
groups another card sort may have.

### Cliques and Neighbourhoods

Cliques and neighbourhoods can be calculated using the `clique`
and `neighbourhood` functions. Given a mapping of sort IDs to card sorts:
`Map<K, Set<T>[]>`, a neighbourhood or clique is represented as a set of IDs:
`Set<K>` of card sorts

#### Neighbourhoods

Neighbourhoods are always deterministic:

```javascript
import {neighbourhood} from "@james-ansley/cardy";

const probe = [new Set([1, 2, 3, 4, 5])];
const sorts = new Map([
    [0, [new Set([1, 2, 3]), new Set([4, 5])]],
    [1, [new Set([1, 2, 3]), new Set([4, 5]), new Set()]],
    [2, [new Set([1, 2]), new Set([3]), new Set([4, 5])]],
    [3, [new Set([1, 2]), new Set([3, 4]), new Set([5])]],
    [4, [new Set([1, 2, 4]), new Set([3, 5])]],
]);

const two_neighbourhood = neighbourhood(2, probe, sorts);
console.log("2-neighbourhood around", probe, "is", two_neighbourhood);
// 2-neighbourhood around [ Set(5) {1, 2, 3, 4, 5} ] is Set(3) { 0, 1, 4 }
```

#### Cliques

Cliques can be non-deterministic — even when using a greedy strategy (default):

```javascript
import {clique} from "@james-ansley/cardy";

const probe = [new Set([1, 2]), new Set([3])];
const sorts = new Map([
    [0, [new Set([1]), new Set([2]), new Set([3])]],
    [1, [new Set([2, 3]), new Set([1])]],
    [2, [new Set([1, 2, 3]),]],
]);

const oneClique = clique(1, probe, sorts);
console.log("1-clique around", probe, "is", [...oneClique]);
// 1-clique around [ Set(2) { 1, 2 }, Set(1) { 3 } ] is [ 0, 1 ]
// OR
// 1-clique around [ Set(2) { 1, 2 }, Set(1) { 3 } ] is [ 1, 2 ]
```

The clique function allows for various heuristic strategies for selecting
candidate card sorts (via ID). Heuristic functions are of the form:
`(int, Map<K, Set<T>[]>, {select(K[]): k}) -> K` — that is, a function that
takes the maximum clique diameter and a key to card sort mapping of viable
candidates, and returns a key of a viable candidate based on some heuristic.

Two heuristic functions have been provided: `randomStrategy` and
`greedyStrategy`. `randomStrategy` will select a candidate at random.
`greedyStrategy` will select a candidate that reduces the size of the candidate
pool by the smallest amount. In the case two or more candidates reduce the pool
by the same amount, one is selected using the provided selector object.

Selector objects are any objects containing a `select<K>(K[]): K` method. They
are used to resolve conflicts when two or more sorts are admissible under the
given heuristic. The `select` method simply picks one — by default at random.

This behaviour can be changed by providing a deterministic heuristic function,
or a deterministic `Selector` which provides a select method that picks a
candidate in the case of ambiguity:

```javascript
import {clique} from "@james-ansley/cardy";

class MinSelector {
    select(collection) {
        return [...collection].sort((a, b) => a < b ? -1 : 0)[0];
    }
}

const probe = [new Set([1, 2]), new Set([3])];
const sorts = new Map([
    [0, [new Set([1]), new Set([2]), new Set([3])]],
    [1, [new Set([2, 3]), new Set([1])]],
    [2, [new Set([1, 2, 3])]],
]);
const oneClique = clique(1, probe, sorts, {selector: new MinSelector()});
console.log("1-clique around", probe, "is", [...oneClique]);
// 1-clique around [ Set(2) { 1, 2 }, Set(1) { 3 } ] is [ 0, 1 ]
```

### Orthogonality

The orthogonality of a collection of sorts can be calculated with the
`orthogonality` function:

```javascript
import {orthogonality} from "@james-ansley/cardy";

const p1 = [
    [new Set([1, 3, 4, 5, 6, 7, 13, 14, 15, 22, 23]),
        new Set([2, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 21, 24, 25, 26])],
    [new Set([1, 3, 4, 6, 7, 10, 13, 14, 15, 18, 23, 26]),
        new Set([2, 5, 8, 9, 11, 12, 16, 17, 19, 20, 21, 22, 24, 25])],
    [new Set([1, 2, 5, 8, 9, 11, 12, 16, 17, 18, 19, 20, 21, 22, 24, 25]),
        new Set([3, 4, 6, 7, 10, 13, 14, 15, 23, 26])],
];

const p1Orthogonality = orthogonality(p1);
console.log("P1 orthogonality:", p1Orthogonality.toFixed(2));
// P1 orthogonality: 2.33
```

[^1]: Deibel, K., Anderson, R. and Anderson, R. (2005), Using edit distance to
analyze card sorts. Expert Systems, 22: 129-138.
https://doi.org/10.1111/j.1468-0394.2005.00304.x

[^2]: Fossum, T. and Haller, S. (2005), Measuring card sort orthogonality.
Expert Systems, 22: 139-146. https://doi.org/10.1111/j.1468-0394.2005.00305.x
