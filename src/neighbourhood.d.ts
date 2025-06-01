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
