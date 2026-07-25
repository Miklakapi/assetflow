import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useApplicationUiStore = defineStore('application-ui', () => {
    const activeModalLayers = ref(0)

    const isModalLayerOpened = computed(() => {
        return activeModalLayers.value > 0
    })

    function openModalLayer(): void {
        activeModalLayers.value += 1
    }

    function closeModalLayer(): void {
        activeModalLayers.value = Math.max(0, activeModalLayers.value - 1)
    }

    return {
        activeModalLayers,
        isModalLayerOpened,
        openModalLayer,
        closeModalLayer,
    }
})
