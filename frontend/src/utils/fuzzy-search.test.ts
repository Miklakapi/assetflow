import { describe, expect, it } from 'vitest'

import { fuzzySearch } from './fuzzy-search'

interface TestItem {
    id: number
    name: string
}

function searchNames(items: string[], query: string, limit?: number) {
    return fuzzySearch(items, query, {
        getValue: (item) => item,
        limit,
    })
}

describe('fuzzySearch', () => {
    describe('matching', () => {
        it('returns an exact match', () => {
            const results = searchNames(['AssetFlow', 'Asset', 'Flow'], 'AssetFlow')

            expect(results).toHaveLength(1)
            expect(results[0]?.item).toBe('AssetFlow')
            expect(results[0]?.matchedIndexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
        })

        it('matches characters in the correct order', () => {
            const results = searchNames(['AssetFlow'], 'af')

            expect(results).toHaveLength(1)
            expect(results[0]?.item).toBe('AssetFlow')
            expect(results[0]?.matchedIndexes).toEqual([0, 5])
        })

        it('does not match characters in the wrong order', () => {
            const results = searchNames(['AssetFlow'], 'fa')

            expect(results).toEqual([])
        })

        it('skips items that do not match the query', () => {
            const results = searchNames(['AssetFlow', 'Invoices', 'Settings'], 'af')

            expect(results.map((result) => result.item)).toEqual(['AssetFlow'])
        })

        it('does not match an empty value against a non-empty query', () => {
            const results = searchNames([''], 'asset')

            expect(results).toEqual([])
        })
    })

    describe('normalization', () => {
        it('ignores letter casing', () => {
            const results = searchNames(['AssetFlow'], 'ASSETFLOW')

            expect(results.map((result) => result.item)).toEqual(['AssetFlow'])
        })

        it('matches a Polish word without diacritics', () => {
            const results = searchNames(['Żółć'], 'zolc')

            expect(results).toHaveLength(1)
            expect(results[0]?.matchedIndexes).toEqual([0, 1, 2, 3])
        })

        it.each([
            ['ą', 'a'],
            ['ć', 'c'],
            ['ę', 'e'],
            ['ł', 'l'],
            ['ń', 'n'],
            ['ó', 'o'],
            ['ś', 's'],
            ['ź', 'z'],
            ['ż', 'z'],
            ['Ą', 'a'],
            ['Ć', 'c'],
            ['Ę', 'e'],
            ['Ł', 'l'],
            ['Ń', 'n'],
            ['Ó', 'o'],
            ['Ś', 's'],
            ['Ź', 'z'],
            ['Ż', 'z'],
        ])('normalizes Polish letter "%s" to "%s"', (value, query) => {
            const results = searchNames([value], query)

            expect(results).toHaveLength(1)
            expect(results[0]?.matchedIndexes).toEqual([0])
        })

        it.each([['asset flow'], ['asset-flow'], ['asset_flow'], ['asset.flow'], ['asset/flow'], ['asset\\flow']])(
            'treats the separator in "%s" as a space',
            (value) => {
                const results = searchNames([value], 'asset flow')

                expect(results).toHaveLength(1)
                expect(results[0]?.item).toBe(value)
            },
        )

        it('collapses multiple separators into a single space', () => {
            const results = searchNames(['asset---___flow'], 'asset flow')

            expect(results).toHaveLength(1)
        })

        it('ignores unsupported special characters', () => {
            const results = searchNames(['a@#$b'], 'ab')

            expect(results).toHaveLength(1)
            expect(results[0]?.matchedIndexes).toEqual([0, 4])
        })

        it('returns indexes referring to the original value', () => {
            const results = searchNames(['Asset-Flow'], 'af')

            expect(results[0]?.matchedIndexes).toEqual([0, 6])
        })

        it('returns original indexes for normalized Polish letters', () => {
            const results = searchNames(['Żółć test'], 'zt')

            expect(results).toHaveLength(1)
            expect(results[0]?.matchedIndexes).toEqual([0, 5])
        })
    })

    describe('ranking', () => {
        it('ranks an exact match before a prefix match', () => {
            const results = searchNames(['application', 'app'], 'app')

            expect(results.map((result) => result.item)).toEqual(['app', 'application'])
        })

        it('ranks a prefix match before a match inside the value', () => {
            const results = searchNames(['my application', 'application'], 'app')

            expect(results.map((result) => result.item)).toEqual(['application', 'my application'])
        })

        it('ranks word boundary matches higher', () => {
            const results = searchNames(['fzzb', 'foo bar'], 'fb')

            expect(results.map((result) => result.item)).toEqual(['foo bar', 'fzzb'])
        })

        it('ranks consecutive matches higher than matches with gaps', () => {
            const results = searchNames(['a-x-b', 'ab'], 'ab')

            expect(results.map((result) => result.item)).toEqual(['ab', 'a-x-b'])
        })

        it('ranks shorter values higher when other match properties are equal', () => {
            const results = searchNames(['abxx', 'ab'], 'a')

            expect(results.map((result) => result.item)).toEqual(['ab', 'abxx'])
        })

        it('sorts alphabetically when scores and lengths are equal', () => {
            const results = searchNames(['ay', 'ax'], 'a')

            expect(results.map((result) => result.item)).toEqual(['ax', 'ay'])
        })

        it('returns results ordered by descending score', () => {
            const results = searchNames(['my application', 'application', 'app'], 'app')

            expect(results.map((result) => result.item)).toEqual(['app', 'application', 'my application'])
            expect(results[0]?.score).toBeGreaterThan(results[1]?.score ?? 0)
            expect(results[1]?.score).toBeGreaterThan(results[2]?.score ?? 0)
        })
    })

    describe('empty query', () => {
        it('returns all items in their original order', () => {
            const results = searchNames(['AssetFlow', 'Invoices', 'Settings'], '')

            expect(results.map((result) => result.item)).toEqual(['AssetFlow', 'Invoices', 'Settings'])
        })

        it('treats whitespace-only query as empty', () => {
            const results = searchNames(['AssetFlow', 'Invoices'], '   ')

            expect(results.map((result) => result.item)).toEqual(['AssetFlow', 'Invoices'])
        })

        it('treats a query containing only separators as empty', () => {
            const results = searchNames(['AssetFlow', 'Invoices'], ' -_./ ')

            expect(results.map((result) => result.item)).toEqual(['AssetFlow', 'Invoices'])
        })

        it('returns a zero score and no matched indexes', () => {
            const results = searchNames(['AssetFlow'], '')

            expect(results[0]).toEqual({
                item: 'AssetFlow',
                value: 'AssetFlow',
                score: 0,
                matchedIndexes: [],
            })
        })

        it('returns an empty array when items are empty', () => {
            const results = searchNames([], '')

            expect(results).toEqual([])
        })
    })

    describe('limit', () => {
        it('limits the number of ranked results', () => {
            const results = searchNames(['app', 'application', 'apple', 'my app'], 'app', 2)

            expect(results).toHaveLength(2)
            expect(results.map((result) => result.item)).toEqual(['app', 'apple'])
        })

        it('limits the number of results for an empty query', () => {
            const results = searchNames(['first', 'second', 'third'], '', 2)

            expect(results.map((result) => result.item)).toEqual(['first', 'second'])
        })

        it('returns an empty array when the limit is zero', () => {
            const results = searchNames(['AssetFlow'], 'asset', 0)

            expect(results).toEqual([])
        })

        it('returns all matching results when no limit is provided', () => {
            const results = searchNames(['app', 'apple', 'application'], 'app')

            expect(results).toHaveLength(3)
        })

        it('returns all matching results when the limit exceeds the number of matches', () => {
            const results = searchNames(['app', 'apple'], 'app', 10)

            expect(results.map((result) => result.item)).toEqual(['app', 'apple'])
        })
    })

    describe('generic items', () => {
        it('searches objects using getValue', () => {
            const items: TestItem[] = [
                {
                    id: 1,
                    name: 'AssetFlow',
                },
                {
                    id: 2,
                    name: 'Invoices',
                },
            ]

            const results = fuzzySearch(items, 'af', {
                getValue: (item) => item.name,
            })

            expect(results).toHaveLength(1)
            expect(results[0]?.item).toBe(items[0])
            expect(results[0]?.value).toBe('AssetFlow')
        })

        it('preserves the original item reference', () => {
            const item: TestItem = {
                id: 1,
                name: 'AssetFlow',
            }

            const results = fuzzySearch([item], 'asset', {
                getValue: (currentItem) => currentItem.name,
            })

            expect(results[0]?.item).toBe(item)
        })

        it('calls getValue for every checked item', () => {
            const items: TestItem[] = [
                {
                    id: 1,
                    name: 'AssetFlow',
                },
                {
                    id: 2,
                    name: 'Invoices',
                },
            ]

            const readIds: number[] = []

            fuzzySearch(items, 'asset', {
                getValue: (item) => {
                    readIds.push(item.id)

                    return item.name
                },
            })

            expect(readIds).toEqual([1, 2])
        })

        it('calls getValue once per item for an empty query', () => {
            const items: TestItem[] = [
                {
                    id: 1,
                    name: 'AssetFlow',
                },
                {
                    id: 2,
                    name: 'Invoices',
                },
            ]

            const readIds: number[] = []

            fuzzySearch(items, '', {
                getValue: (item) => {
                    readIds.push(item.id)

                    return item.name
                },
            })

            expect(readIds).toEqual([1, 2])
        })
    })
})
