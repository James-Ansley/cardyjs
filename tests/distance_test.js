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

import {assertEquals} from "jsr:@std/assert";
import {distance} from "../src/distance.js";

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
