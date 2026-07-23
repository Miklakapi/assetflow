import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getMenu } from '@/domain/menu/api'
import type { MenuItem } from '@/domain/menu/schema'
import { toDataError, type DataError } from '@/utils/api'

export const useMenuStore = defineStore('menu', () => {
    const items = ref<MenuItem[]>([])
    const isLoading = ref(false)
    const isLoaded = ref(false)
    const error = ref<DataError | null>(null)

    let loadPromise: Promise<void> | null = null

    async function loadMenu(): Promise<void> {
        if (isLoaded.value) {
            return
        }

        if (loadPromise) {
            return loadPromise
        }

        loadPromise = fetchMenu()

        try {
            await loadPromise
        } finally {
            loadPromise = null
        }
    }

    async function reloadMenu(): Promise<void> {
        isLoaded.value = false

        await loadMenu()
    }

    async function fetchMenu(): Promise<void> {
        try {
            isLoading.value = true
            error.value = null

            const response = await getMenu()

            items.value = response.items
            isLoaded.value = true
        } catch (requestError) {
            items.value = []
            isLoaded.value = false
            error.value = toDataError(requestError)
        } finally {
            isLoading.value = false
        }
    }

    return {
        items,
        isLoading,
        isLoaded,
        error,
        loadMenu,
        reloadMenu,
    }
})
