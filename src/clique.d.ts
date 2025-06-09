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

export type Selector<T> = {
    select(candidates: T[]): T;
}

type Strategy<K, T> = (
    d: number,
    candidates: Map<K, Set<T>[]>,
    selector: Selector<K>,
) => K;

/**
 * Computes the d-clique centred around the given probe sort using the given
 * heuristic strategy.
 *
 * The card sorts collection does not need to contain the probe sort. The probe
 * sort will not be included in the result in this case.
 *
 * The strategy is a heuristic used to select candidate card sorts to add to
 * the clique. See <https://doi.org/10.1111/j.1468-0394.2005.00304.x> for more.
 *
 * @template K
 * @template T
 * @param {number} d The max distance between any two sorts in the clique
 * @param {Set<T>[]} probe The starting probe sort
 * @param {Map<K, Set<T>[]>} sorts The collection of card sorts to search for the clique in
 * @param {Object} options
 * @param {Strategy<K, T>} options.strategy The heuristic strategy for
 * selecting candidates to add to the clique.
 * @param {Selector<K>} options.selector An object to resolve collisions in
 * selected candidates in the heuristic function
 * @returns A d-clique around the probe sort
 */
export function clique<K, T>(
    d: number,
    probe: Set<T>[],
    sorts: Map<K, Set<T>[]>,
    options?: { strategy?: Strategy<K, T>; selector: Selector<K> },
): Set<K>;

/**
 * A heuristic strategy to select candidates from a set of sorts to add to a
 * clique. See: <https://doi.org/10.1111/j.1468-0394.2005.00304.x>
 *
 * In the case where two or more candidates reduce the candidate pool by the
 * same amount, one is chosen at random using the given selector.
 *
 * @param d The max distance between any two sorts in the clique
 * @param candidates The intersection of the current clique
 *     sort neighbourhoods
 * @param selector An object to select an item from a collection
 * @returns An element that reduces the clique size by the smallest amount
 */
export function greedyStrategy<K, T>(
    d: number,
    candidates: Map<K, Set<T>[]>,
    selector: Selector<K>,
): K;

/**
 * A heuristic strategy to select clique candidates at random.
 *
 * @param d
 * @param candidates
 * @param selector
 */
export function randomStrategy<K, T>(
    d: number,
    candidates: Map<K, Set<T>[]>,
    selector: Selector<K>,
): K;

/**
 * Resolves discrepancies in heuristic selections by selecting an item at random
 */
export class RandomSelector<K> implements Selector<K> {
    select(values: K[]): K;
}
