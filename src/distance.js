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

/* @ts-self-types="./distance.d.ts" */

import {maxCost} from "@alg/munkres";


export function distance(sort1, sort2) {
    const numCards = sort1.reduce((a, e) => a + e.size, 0);
    const weights = sort1.map(g1 => sort2.map(g2 => g1.intersection(g2).size));
    return numCards - maxCost(weights);
}
