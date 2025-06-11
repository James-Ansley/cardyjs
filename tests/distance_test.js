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

import {assertEquals, assertAlmostEquals} from "jsr:@std/assert";
import {distance, normDistance} from "../src/distance.js";
import {maxDistance} from "../src/main.js";

function set(...values) {
    return new Set(values);
}


Deno.test({
    name: "empty card sorts have a distance of zero",
    fn: () => assertEquals(distance([], []), 0),
});

Deno.test({
    name: "equivalent card sorts have an edit distance of zero",
    fn: () => {
        assertEquals(distance([set(1)], [set(1)]), 0);
        assertEquals(distance([set(1), set(2)], [set(1), set(2)]), 0);
        assertEquals(distance([set(2), set(1)], [set(1), set(2)]), 0);
        assertEquals(
            distance(
                [set(1, 2, 3), set(4), set(5, 6)],
                [set(4), set(1, 2, 3), set(5, 6)],
            ),
            0,
        );
    },
});

Deno.test({
    name: "empty groups are ignored when computing distances",
    fn: () => {
        assertEquals(distance([set(1), set(2), set()], [set(1), set(2)]), 0);
        assertEquals(distance([set(1), set(2)], [set(1), set(), set(2)]), 0);
    },
});

Deno.test({
    name: "single card displacements have an edit distance of one",
    fn: () => {
        assertEquals(distance([set(1, 2), set(3)], [set(1), set(2, 3)]), 1);
        assertEquals(
            distance([set(1), set(2), set(3)], [set(1), set(2, 3)]),
            1,
        );
        assertEquals(distance([set(1), set(2, 3)], [set(1, 2, 3)]), 1);
    },
});

Deno.test({
    name: "distance between card sorts is computed for multiple moves",
    fn: () => {
        assertEquals(distance(
            [set(1, 2, 3), set(4, 5, 6), set(7, 8, 9)],
            [set(1, 2), set(3, 4), set(5, 6, 7), set(8, 9)],
        ), 3);
        assertEquals(distance(
            [set(1, 2), set(3, 4), set(5, 6, 7), set(8, 9)],
            [set(1, 2, 3), set(4, 5, 6), set(7, 8, 9)],
        ), 3);
    },
});

Deno.test({
    name: "The maximum edit distance is computed for card sorts",
    fn: () => {
        const sort1 = [
            ["a1", "a2", "a3"],
            ["b1", "b2", "b3", "b4", "b5"],
            ["c1", "c2", "c3", "c4", "c5"],
            ["d1", "d2", "d3", "d4"],
        ].map((e) => new Set(e));
        assertEquals(maxDistance(sort1), 13);
        assertEquals(maxDistance(sort1, {numGroups: 4}), 12);
    },
});

Deno.test({
    name: "The normalised edit distance is computed for card sorts",
    fn: () => {
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
        const sort3 = [
            ["a1", "b1", "c1", "d1"],
            ["a2", "b2", "c2", "d2"],
            ["a3", "b3", "c3", "d3"],
            ["b4", "c4", "d4"],
            ["b5", "c5"],
        ].map((e) => new Set(e));
        const sort4 = [
            ["a1", "a2"],
            ["a3", "b1", "b2", "b3", "b4", "b5"],
            ["c1", "c2", "c3", "c4", "c5"],
            ["d1", "d2", "d3", "d4"],
        ].map((e) => new Set(e));
        assertEquals(normDistance(sort1, sort2, {numGroups: 4}), 1);
        assertEquals(normDistance(sort1, sort3), 1);
        assertAlmostEquals(normDistance(sort1, sort4, {numGroups: 4}), 1 / 12);
    },
});
