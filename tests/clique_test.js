/* Copyright 2025 Cardy Contributors
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

import {assertEquals} from "jsr:@std/assert";
import {clique} from "../src/clique.js";
import examples from "./examples.json" with {type: "json"};


function set(...values) {
    return new Set(values);
}


function loadExamples() {
    const result = new Map();
    for (const [k, v] of Object.entries(examples)) {
        result.set(k, [...Object.values(v).map((e) => new Set(e))]);
    }
    return result;
}


class MinSelector {
    select(collection) {
        return [...collection].sort((a, b) => a < b ? -1 : 0)[0];
    }
}

class MaxSelector {
    select(collection) {
        return [...collection].sort((a, b) => a > b ? -1 : 0)[0];
    }
}

//
//
Deno.test({
    name: "a clique of equivalent sorts returns the whole set of sort ids",
    fn: () => {

    },
});
//     assert clique(0, (set(1), set(2)), {0: (set(1), set(2)), 1: (set(2), set(1))}) == set(0, 1)
//     assert clique(1, (set(1), set(2)), {0: (set(1), set(2)), 1: (set(2), set(1))}) == set(0, 1)
//
//
Deno.test({
    name: "cliques do not necessarily contain the probe sort",
    fn: () => {
        assertEquals(clique(0, [set(1, 2)], new Map([
            [0, [set(1), set(2)]],
            [1, [set(2), set(1)]],
        ])), set());
        assertEquals(clique(1, [set(1, 2)], new Map([
            [0, [set(1), set(2)]],
            [1, [set(2), set(1)]],
        ])), set(0, 1));
    },
});

//
//
Deno.test({
    name: "cliques exclude items even if they are in the neighbourhood of the card sort",
    fn: () => {
        const sorts = new Map([
            [0, [new Set([1]), new Set([2]), new Set([3])]],
            [1, [new Set([2, 3]), new Set([1])]],
            [2, [new Set([1, 2, 3])]],
        ]);
        const probe = [set(1, 2), set(3)];
        assertEquals(
            clique(1, probe, sorts, {selector: new MinSelector()}),
            set(0, 1),
        );
        assertEquals(
            clique(1, probe, sorts, {selector: new MaxSelector()}),
            set(1, 2),
        );
    },
});


// Examples taken from: https://doi.org/10.1111/j.1468-0394.2005.00304.x
Deno.test({
    name: "example cliques",
    fn: () => {
        const sorts = loadExamples();
        const minSelector = {selector: new MinSelector()}
        const maxSelector = {selector: new MaxSelector()}

        // Table 5 Deibel et al.
        assertEquals(
            clique(4, sorts.get("table-5-0/8-4"), sorts),
            set(
                "table-5-0/8-4", "table-5-1", "table-5-2", "table-5-3",
                "table-5-4", "table-5-5", "table-5-6", "table-5-7",
                "table-5-8", "table-5-9/8-5",
            ),
        );

        // Table 6 Deibel et al.
        assertEquals(
            clique(5, sorts.get("table-6-0"), sorts, minSelector),
            set(
                "table-6-0", "table-6-1", "table-6-2", "table-6-3",
                "table-6-4", "table-6-5", "table-6-6", "table-6-7",
            ),
        );

        // Table 7 Deibel et al.
        assertEquals(
            clique(5, sorts.get("table-7-0"), sorts),
            set(
                "table-7-0", "table-7-1", "table-7-2",
                "table-7-3", "table-7-4", "table-7-5",
            ),
        );

        // Table 8 Deibel et al.
        assertEquals(
            clique(5, sorts.get("table-8-0"), sorts, maxSelector),
            set(
                "table-8-0", "table-8-1", "table-8-2", "table-8-3",
                "table-5-0/8-4", "table-5-9/8-5",
            ),
        );
    },
});
