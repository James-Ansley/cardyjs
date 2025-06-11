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
