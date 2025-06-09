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
import {neighbourhood} from "../src/neighbourhood.js";

function set(...values) {
    return new Set(values);
}

const SORTS = new Map([
    [0, [set(1, 2, 3), set(4, 5)]],
    [1, [set(1, 2, 3), set(4, 5), set()]],
    [2, [set(1, 2), set(3), set(4, 5)]],
    [3, [set(1, 2), set(3, 4), set(5)]],
    [4, [set(1, 2, 4), set(3, 5)]],
]);

Deno.test({
    name: "zero neighbourhoods only include equivalent card sorts",
    fn: () => {
        assertEquals(neighbourhood(0, SORTS.get(0), SORTS), set(0, 1));
        assertEquals(neighbourhood(0, SORTS.get(2), SORTS), set(2));
        assertEquals(neighbourhood(0, [set(1, 2, 3, 4, 5)], SORTS), set());
    },
});

Deno.test({
    name: "neighbourhoods are returned when sorts have different distances",
    fn: () => {
        assertEquals(neighbourhood(1, SORTS.get(0), SORTS), set(0, 1, 2));
        assertEquals(neighbourhood(2, SORTS.get(0), SORTS), set(0, 1, 2, 3, 4));
        assertEquals(
            neighbourhood(2, [set(1, 2, 3, 4, 5)], SORTS),
            set(0, 1, 4),
        );
        assertEquals(
            neighbourhood(3, [set(1, 2, 3, 4, 5)], SORTS),
            set(0, 1, 2, 3, 4),
        );
    },
});
