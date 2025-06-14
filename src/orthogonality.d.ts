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
 * Returns the orthogonality of the given collection of sorts.
 *
 * An alternative edit distance function can be passed in as an option.
 *
 * See: https://doi.org/10.1111/j.1468-0394.2005.00305.x
 *
 * @template T
 * @param {Set<T>[][]} sorts
 * @param {Object} options
 * @param {(sort1: Set<T>[], sort2: Set<T>[]) => number} options.distance
 */
export function orthogonality<T>(
    sorts: Set<T>[][],
    options?: {distance?: (sort1: Set<T>[], sort2: Set<T>[]) => number}
): number;
