<template>
    <div ref="searchRef" class="application-search">
        <Search class="application-search-icon" :size="16" />

        <input
            ref="inputRef"
            v-model="query"
            class="application-search-input"
            type="search"
            placeholder="Search menu..."
            autocomplete="off"
            @focus="openResults"
            @keydown.down.prevent="selectNextResult"
            @keydown.up.prevent="selectPreviousResult"
            @keydown.enter.prevent="openSelectedResult"
            @keydown.esc="closeSearch"
        />

        <kbd class="application-search-shortcut">
            {{ shortcutLabel }}
        </kbd>

        <div v-if="resultsVisible" class="application-search-results">
            <button
                v-for="(result, index) in filteredItems"
                :key="result.item.id"
                :class="{ 'application-search-result-selected': selectedResultIndex === index }"
                class="application-search-result"
                type="button"
                @mouseenter="selectedResultIndex = index"
                @click="openResult(result.item)"
            >
                <span class="application-search-result-label">
                    {{ result.item.label }}
                </span>

                <span class="application-search-result-path">
                    <FuzzyHighlight :value="result.value" :matched-indexes="result.matchedIndexes" />
                </span>
            </button>

            <div v-if="query && !filteredItems.length" class="application-search-empty">No results found</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { MenuItem } from '@/domain/menu/schema'
import { useMenuStore } from '@/stores/menu'
import { fuzzySearch } from '@/utils/fuzzy-search'
import FuzzyHighlight from '@/components/FuzzyHighlight.vue'

const router = useRouter()
const menu = useMenuStore()

const searchRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const resultsOpened = ref(false)
const selectedResultIndex = ref(0)

const shortcutLabel = computed(() => {
    return isMacPlatform() ? '⌘ K' : 'Ctrl K'
})

const searchableItems = computed(() => {
    return flattenMenuItems(menu.items)
})

const filteredItems = computed(() => {
    return fuzzySearch(searchableItems.value, query.value, {
        getValue: (item) => item.path,
        limit: 8,
    })
})

const resultsVisible = computed(() => {
    return resultsOpened.value && (query.value.length > 0 || filteredItems.value.length > 0)
})

function flattenMenuItems(items: MenuItem[], parentLabels: string[] = []): Array<MenuItem & { path: string }> {
    return items.flatMap((item) => {
        const labels = [...parentLabels, item.label]
        const currentItem = item.route
            ? [
                  {
                      ...item,
                      path: labels.join(' / '),
                  },
              ]
            : []

        return [...currentItem, ...flattenMenuItems(item.children, labels)]
    })
}

function isMacPlatform(): boolean {
    return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
}

function openResults(): void {
    resultsOpened.value = true
    selectedResultIndex.value = 0
}

function closeSearch(): void {
    resultsOpened.value = false
    query.value = ''
    selectedResultIndex.value = 0
    inputRef.value?.blur()
}

function selectNextResult(): void {
    if (!filteredItems.value.length) {
        return
    }

    resultsOpened.value = true
    selectedResultIndex.value = (selectedResultIndex.value + 1) % filteredItems.value.length
}

function selectPreviousResult(): void {
    if (!filteredItems.value.length) {
        return
    }

    resultsOpened.value = true
    selectedResultIndex.value =
        (selectedResultIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length
}

function openSelectedResult(): void {
    const result = filteredItems.value[selectedResultIndex.value]

    if (!result) {
        return
    }

    openResult(result.item)
}

function openResult(item: MenuItem): void {
    if (!item.route) {
        return
    }

    router.push(item.route)
    closeSearch()
}

function handleKeyboardShortcut(event: KeyboardEvent): void {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') {
        return
    }

    event.preventDefault()
    inputRef.value?.focus()
    openResults()
}

function closeOnOutsideClick(event: PointerEvent): void {
    const target = event.target

    if (!(target instanceof Node)) {
        return
    }

    if (searchRef.value?.contains(target)) {
        return
    }

    resultsOpened.value = false
}

onMounted(() => {
    menu.loadMenu()

    document.addEventListener('keydown', handleKeyboardShortcut)
    document.addEventListener('pointerdown', closeOnOutsideClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyboardShortcut)
    document.removeEventListener('pointerdown', closeOnOutsideClick)
})
</script>

<style scoped>
.application-search {
    position: relative;
    display: flex;
    width: min(420px, 40vw);
    height: 32px;
    align-items: center;
}

.application-search-icon {
    position: absolute;
    left: 10px;
    color: #9ca3af;
    pointer-events: none;
}

.application-search-input {
    width: 100%;
    height: 32px;
    padding: 0 58px 0 34px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    outline: none;
    background: #f9fafb;
    color: #1f2937;
    font-size: 13px;
}

.application-search-input:focus {
    border-color: #c7d2fe;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgb(99 102 241 / 10%);
}

.application-search-input::placeholder {
    color: #9ca3af;
}

.application-search-shortcut {
    position: absolute;
    right: 7px;
    padding: 1px 5px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #ffffff;
    color: #6b7280;
    font-family: inherit;
    font-size: 10px;
    line-height: 17px;
    pointer-events: none;
}

.application-search-results {
    position: absolute;
    z-index: 20;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    padding: 5px;
    border: 1px solid #e5e7eb;
    border-radius: 9px;
    background: #ffffff;
    box-shadow: 0 12px 30px rgb(15 23 42 / 12%);
}

.application-search-result {
    display: flex;
    width: 100%;
    min-height: 36px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 9px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: #374151;
    text-align: left;
    cursor: pointer;
}

.application-search-result:hover,
.application-search-result-selected {
    background: #f3f4f6;
}

.application-search-result-label {
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.application-search-result-path {
    overflow: hidden;
    color: #9ca3af;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.application-search-empty {
    padding: 12px 9px;
    color: #9ca3af;
    font-size: 13px;
    text-align: center;
}
</style>
