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

import type {Selector, Strategy} from "./clique.d.ts";

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
 * Computes the edit distance between the two given card sorts.
 *
 * @template T
 * @param {Set<T>[]} sort1
 * @param {Set<T>[]} sort2
 */
export function distance<T>(
    sort1: Set<T>[],
    sort2: Set<T>[],
): number;

/**
 * Computes the normalised edit distance between the two given card sorts.
 *
 * If `numGroups` is given, computes the normalised edit distance given both
 * sorts use `numGroups` or fewer groups.
 *
 * @template T
 * @param {Set<T>[]} sort1
 * @param {Set<T>[]} sort2
 * @param {Object} options
 * @param {number} options.numGroups
 */
export function normDistance<T>(
    sort1: Set<T>[],
    sort2: Set<T>[],
    options?: {numGroups?: number},
): number;

/**
 * Computes the maximum edit distance any other card sort can be to the given
 * card sort.
 *
 * If `numGroups` is given, computes the maximum edit distance any other card
 * sort containing `numGroups` or fewer groups can be to the given card sort.
 *
 * @template T
 * @param {Set<T>[]} sort
 * @param {Object} options
 * @param {number} options.numGroups
 */
export function maxDistance<T>(
    sort: Set<T>[],
    options?: {numGroups?: number},
): number;

/**
 * Returns the d-neighbourhood of the given probe sort in the sorts iterable.
 *
 * The probe sort does not need to be one of the given sorts and will not be
 * included in the result if it is not.
 *
 * @template K
 * @template T
 * @param {number} d The max distance neighbourhood elements and the probe
 * @param {Set<T>[]} probe The sort at the centre of the neighbourhood
 * @param {Map<K, Set<T>[]>} sorts A collection of sorts in which to search
 * for the neighbourhood
 * @returns {Set<K>} The d-neighbourhood of the given probe
 */
export function neighbourhood<K, T>(
    d: number,
    probe: Set<T>[],
    sorts: Map<K, Set<T>[]>,
): Set<K>;

/**
 * Returns the orthogonality of the given collection of sorts.
 *
 * See: https://doi.org/10.1111/j.1468-0394.2005.00305.x
 *
 * @template T
 * @param {Set<T>[][]} sorts
 */
export function orthogonality<T>(
    sorts: Set<T>[][],
): number;
