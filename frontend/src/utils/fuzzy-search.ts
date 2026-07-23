export interface FuzzySearchResult<T> {
    item: T
    value: string
    score: number
    matchedIndexes: number[]
}

export interface FuzzySearchOptions<T> {
    getValue: (item: T) => string
    limit?: number
}

interface NormalizedValue {
    value: string
    originalIndexes: number[]
}

interface FuzzyMatch {
    score: number
    matchedIndexes: number[]
}

export function fuzzySearch<T>(items: T[], query: string, options: FuzzySearchOptions<T>): FuzzySearchResult<T>[] {
    const normalizedQuery = normalizeSearchValue(query).value

    if (!normalizedQuery) {
        return items.slice(0, options.limit).map((item) => ({
            item,
            value: options.getValue(item),
            score: 0,
            matchedIndexes: [],
        }))
    }

    const results: FuzzySearchResult<T>[] = []

    for (const item of items) {
        const value = options.getValue(item)
        const match = fuzzyMatch(value, normalizedQuery)

        if (!match) {
            continue
        }

        results.push({
            item,
            value,
            score: match.score,
            matchedIndexes: match.matchedIndexes,
        })
    }

    results.sort((firstResult, secondResult) => {
        if (firstResult.score !== secondResult.score) {
            return secondResult.score - firstResult.score
        }

        if (firstResult.value.length !== secondResult.value.length) {
            return firstResult.value.length - secondResult.value.length
        }

        return firstResult.value.localeCompare(secondResult.value)
    })

    return results.slice(0, options.limit)
}

function fuzzyMatch(value: string, normalizedQuery: string): FuzzyMatch | null {
    const normalizedValue = normalizeSearchValue(value)
    const matchedNormalizedIndexes: number[] = []
    let queryIndex = 0

    if (!normalizedValue.value) {
        return null
    }

    for (let valueIndex = 0; valueIndex < normalizedValue.value.length; valueIndex += 1) {
        const valueCharacter = normalizedValue.value[valueIndex]
        const queryCharacter = normalizedQuery[queryIndex]

        if (valueCharacter === undefined || queryCharacter === undefined) {
            continue
        }

        if (valueCharacter !== queryCharacter) {
            continue
        }

        matchedNormalizedIndexes.push(valueIndex)
        queryIndex += 1

        if (queryIndex === normalizedQuery.length) {
            break
        }
    }

    if (queryIndex !== normalizedQuery.length) {
        return null
    }

    return {
        score: calculateScore(normalizedValue.value, normalizedQuery, matchedNormalizedIndexes),
        matchedIndexes: getOriginalMatchedIndexes(normalizedValue.originalIndexes, matchedNormalizedIndexes),
    }
}

function calculateScore(value: string, query: string, matchedIndexes: number[]): number {
    const firstMatchedIndex = matchedIndexes[0] ?? 0
    let score = query.length * 10

    if (value === query) {
        score += 1000
    } else if (value.startsWith(query)) {
        score += 500
    } else if (value.includes(query)) {
        score += 250
    }

    score += getWordBoundaryScore(value, matchedIndexes)
    score += getConsecutiveMatchScore(matchedIndexes)
    score -= getGapPenalty(matchedIndexes)
    score -= firstMatchedIndex * 2
    score -= Math.max(0, value.length - query.length) * 0.1

    return score
}

function getWordBoundaryScore(value: string, matchedIndexes: number[]): number {
    let score = 0

    for (const index of matchedIndexes) {
        if (index === 0 || value[index - 1] === ' ') {
            score += 30
        }
    }

    return score
}

function getConsecutiveMatchScore(matchedIndexes: number[]): number {
    let score = 0
    let consecutiveLength = 1

    for (let index = 1; index < matchedIndexes.length; index += 1) {
        const currentIndex = matchedIndexes[index]
        const previousIndex = matchedIndexes[index - 1]

        if (currentIndex === undefined || previousIndex === undefined) {
            continue
        }

        if (currentIndex === previousIndex + 1) {
            consecutiveLength += 1
            score += consecutiveLength * 8
        } else {
            consecutiveLength = 1
        }
    }

    return score
}

function getGapPenalty(matchedIndexes: number[]): number {
    let penalty = 0

    for (let index = 1; index < matchedIndexes.length; index += 1) {
        const currentIndex = matchedIndexes[index]
        const previousIndex = matchedIndexes[index - 1]

        if (currentIndex === undefined || previousIndex === undefined) {
            continue
        }

        const gap = currentIndex - previousIndex - 1

        penalty += gap * 2
    }

    return penalty
}

function getOriginalMatchedIndexes(originalIndexes: number[], matchedNormalizedIndexes: number[]): number[] {
    const matchedIndexes: number[] = []

    for (const normalizedIndex of matchedNormalizedIndexes) {
        const originalIndex = originalIndexes[normalizedIndex]

        if (originalIndex === undefined || matchedIndexes.includes(originalIndex)) {
            continue
        }

        matchedIndexes.push(originalIndex)
    }

    return matchedIndexes
}

function normalizeSearchValue(value: string): NormalizedValue {
    const characters: string[] = []
    const originalIndexes: number[] = []

    for (let index = 0; index < value.length; index += 1) {
        const originalCharacter = value[index]

        if (originalCharacter === undefined) {
            continue
        }

        const normalizedCharacter = normalizeCharacter(originalCharacter)

        for (const character of normalizedCharacter) {
            characters.push(character)
            originalIndexes.push(index)
        }
    }

    return normalizeSpaces(characters, originalIndexes)
}

function normalizeCharacter(character: string): string {
    const normalizedCharacter = character
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()

    if (/^[a-z0-9]$/.test(normalizedCharacter)) {
        return normalizedCharacter
    }

    if (/[\s/\\._-]/.test(character)) {
        return ' '
    }

    return ''
}

function normalizeSpaces(characters: string[], originalIndexes: number[]): NormalizedValue {
    const normalizedCharacters: string[] = []
    const normalizedOriginalIndexes: number[] = []

    for (let index = 0; index < characters.length; index += 1) {
        const character = characters[index]
        const originalIndex = originalIndexes[index]
        const previousCharacter = normalizedCharacters[normalizedCharacters.length - 1]

        if (character === undefined || originalIndex === undefined) {
            continue
        }

        if (character === ' ' && (normalizedCharacters.length === 0 || previousCharacter === ' ')) {
            continue
        }

        normalizedCharacters.push(character)
        normalizedOriginalIndexes.push(originalIndex)
    }

    if (normalizedCharacters[normalizedCharacters.length - 1] === ' ') {
        normalizedCharacters.pop()
        normalizedOriginalIndexes.pop()
    }

    return {
        value: normalizedCharacters.join(''),
        originalIndexes: normalizedOriginalIndexes,
    }
}
