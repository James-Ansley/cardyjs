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

/* @ts-self-types="./clique.d.ts" */

import {distance as editDistance} from "./distance.js";
import {neighbourhood} from "./neighbourhood.js";


class RandomSelector {
    select(values) {
        return values[Math.floor(Math.random() * values.length)]
    }
}


export function randomStrategy(_, candidates, selector) {
    const keys = Array.from(candidates.keys());
    return selector.select(keys);
}


export function greedyStrategy(
    d,
    candidates,
    selector,
    {distance = (sort1, sort2) => editDistance(sort1, sort2)} = {},
    ) {
    let currentMax = 0;
    let maxCandidates = [];
    for (const [key, candidate] of candidates.entries()) {
        const size = neighbourhood(
            d, candidate, candidates, {distance: distance},
            ).size;
        if (size > currentMax) {
            maxCandidates = [key];
            currentMax = size
        } else if (size === currentMax) {
            maxCandidates.push(key);
        }
    }
    return selector.select(maxCandidates);
}


export function clique(
    d,
    probe,
    sorts,
    {
        strategy = greedyStrategy, selector = new RandomSelector(),
        distance = (sort1, sort2) => editDistance(sort1, sort2),
    } = {}
) {
    const cliqueSet = new Set(
        sorts.entries()
            .filter(([_, s]) => distance(probe, s) === 0)
            .map(([k, _]) => k),
    );
    let candidates = new Map(
        sorts.entries()
            .filter(([_, s]) => between(distance(probe, s), 0, d)),
    );
    while (candidates.size !== 0) {
        const selected = strategy(d, candidates, selector);
        cliqueSet.add(selected);
        candidates = new Map(
            candidates.entries()
                .filter(([k, s]) =>
                    k !== selected
                    && distance(candidates.get(selected), s) <= d,
                ),
        );
    }
    return cliqueSet;
}

function between(val, lo, hi) {
    return lo < val && val <= hi;
}
