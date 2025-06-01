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

import {
    DisjointSet,
    minSpanningTree,
    orthogonality,
} from "../src/orthogonality.js";
import {range} from "@alg/range";
import {assertEquals, assertAlmostEquals} from "jsr:@std/assert";


const example1 = [
    [
        new Set([1, 3, 4, 5, 6, 7, 13, 14, 15, 22, 23]),
        new Set([2, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 21, 24, 25, 26]),
    ],
    [
        new Set([1, 3, 4, 6, 7, 10, 13, 14, 15, 18, 23, 26]),
        new Set([2, 5, 8, 9, 11, 12, 16, 17, 19, 20, 21, 22, 24, 25]),
    ],
    [
        new Set([1, 2, 5, 8, 9, 11, 12, 16, 17, 18, 19, 20, 21, 22, 24, 25]),
        new Set([3, 4, 6, 7, 10, 13, 14, 15, 23, 26]),
    ],
];

const example2 = [
    [
        new Set([9, 17, 18, 25]),
        new Set([1, 3, 5, 8, 12, 13, 20, 26]),
        new Set([2, 6, 7, 10, 11, 15, 19, 22]),
        new Set([4, 14, 16, 21, 23]),
        new Set([24]),
    ],
    [
        new Set([12, 20]),
        new Set([18, 25]),
        new Set([3, 13, 19]),
        new Set([5, 10, 15]),
        new Set([1, 17]),
        new Set([8, 9]),
        new Set([2, 4, 6, 7, 11, 14, 16, 21, 22, 23, 24, 26]),
    ],
    [
        new Set([
            1, 3, 5, 6, 7, 9, 10, 11, 12, 14,
            15, 16, 18, 19, 20, 21, 25, 26,
        ]),
        new Set([2, 4, 8, 13, 17, 22, 23, 24]),
    ],
];

Deno.test({
    name: "disjoint sets",
    fn: () => {
        const forest = new DisjointSet(range(1, 11));
        range(1, 11).forEach((i) => assertEquals(forest.find(i), i));
        forest.merge(1, 2);
        forest.merge(2, 3);
        forest.merge(3, 3);
        forest.merge(3, 4);
        const root = forest.find(1);
        forest.merge(5, 6);
        forest.merge(6, 4);
        assertEquals(forest.find(6), root);
    },
});

Deno.test({
    name: "Spanning trees",
    fn: () => {
        const vertices = ["A", "B", "C", "D", "E", "F", "G"];
        const edgesWeights = Object.fromEntries([
            [["A", "D"], 5], [["C", "E"], 5], [["D", "F"], 6], [["A", "B"], 7],
            [["B", "E"], 7], [["B", "C"], 8], [["B", "D"], 9], [["D", "E"], 15],
            [["E", "F"], 8], [["E", "G"], 9], [["F", "G"], 11],
        ]);
        const edges = [
            ["A", "B"], ["A", "D"], ["B", "C"], ["B", "D"],
            ["B", "E"], ["C", "E"], ["D", "E"], ["D", "F"],
            ["E", "F"], ["E", "G"], ["F", "G"],
        ].sort((e1, e2) => edgesWeights[e1] - edgesWeights[e2]);
        assertEquals(
            minSpanningTree(vertices, edges),
            [["A", "D"], ["C", "E"], ["D", "F"],
                ["A", "B"], ["B", "E"], ["E", "G"]],
        );
    },
});

Deno.test({
    name: "orthogonality",
    fn: () => {
        assertAlmostEquals(orthogonality(example1), 7 / 3);  // 2.33...
        assertAlmostEquals(orthogonality(example2), 11.0);
    },
});
