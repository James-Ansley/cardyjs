/* Copyright 2025 James Finnie-Ansley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @ts-self-types="./orthogonality.d.ts" */

import {distance} from "./distance.js";
import {range} from "@alg/range";


export class DisjointSet {
    #parents;
    #sizes;

    constructor(values) {
        this.#parents = Object.fromEntries(values.map(e => [e, e]));
        this.#sizes = Object.fromEntries(values.map(e => [e, 1]));
    }

    find(e) {
        let root = e;
        while (this.#parents[root] !== root) {
            root = this.#parents[root];
        }
        while (this.#parents[e] !== root) {
            const parent = this.#parents[e];
            this.#parents[e] = root;
            e = parent;
        }
        return root;

    }

    merge(e1, e2) {
        e1 = this.find(e1);
        e2 = this.find(e2);
        if (e1 === e2) {
            return;
        }
        if (this.#sizes[e1] < this.#sizes[e2]) {
            [e1, e2] = [e2, e1];
        }
        this.#parents[e2] = e1;
        this.#sizes[e1] += this.#sizes[e2];
    }
}

export function minSpanningTree(vertices, edges) {
    const f = [];
    const forest = new DisjointSet(vertices);
    for (const [e1, e2] of edges) {
        if (forest.find(e1) !== forest.find(e2)) {
            f.push([e1, e2]);
            forest.merge(e1, e2);
        }
    }
    return f;
}

function combinations(values) {
    values = [...values];
    const result = [];
    for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
            result.push([values[i], values[j]]);
        }
    }
    return result;
}

export function orthogonality(sorts) {
    const indices = range(sorts.length);
    const edges = combinations(indices);
    const edgeWeights = Object.fromEntries(
        edges.map(([i, j]) => [[i, j], distance(sorts[i], sorts[j])]),
    );
    edges.sort((e1, e2) => edgeWeights[e1] - edgeWeights[e2]);
    const tree = minSpanningTree(indices, edges);
    const totalWeight = tree.map((e) => edgeWeights[e]).reduce((a, b) => a + b);
    return totalWeight / sorts.length;
}
