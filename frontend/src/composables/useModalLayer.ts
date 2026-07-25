import { computed, onBeforeUnmount, ref } from 'vue'

import { useApplicationUiStore } from '@/stores/application-ui'

export function useModalLayer() {
    const applicationUi = useApplicationUiStore()

    const active = ref(false)
    const layerPosition = ref(0)

    const isTopLayer = computed(() => {
        return active.value && applicationUi.activeModalLayers === layerPosition.value
    })

    let applicationElement: HTMLElement | null = null
    let applicationWasInert = false
    let previousBodyOverflow = ''

    function activate(): void {
        if (active.value) {
            return
        }

        lockApplication()
        lockBodyScroll()

        applicationUi.openModalLayer()

        layerPosition.value = applicationUi.activeModalLayers
        active.value = true
    }

    function deactivate(): void {
        if (!active.value) {
            return
        }

        unlockApplication()
        unlockBodyScroll()

        applicationUi.closeModalLayer()

        layerPosition.value = 0
        active.value = false
    }

    function lockApplication(): void {
        applicationElement = document.querySelector<HTMLElement>('#app')
        applicationWasInert = applicationElement?.inert ?? false

        if (applicationElement) {
            applicationElement.inert = true
        }
    }

    function unlockApplication(): void {
        if (applicationElement) {
            applicationElement.inert = applicationWasInert
        }

        applicationElement = null
        applicationWasInert = false
    }

    function lockBodyScroll(): void {
        previousBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
    }

    function unlockBodyScroll(): void {
        document.body.style.overflow = previousBodyOverflow
        previousBodyOverflow = ''
    }

    onBeforeUnmount(() => {
        deactivate()
    })

    return {
        active,
        isTopLayer,
        activate,
        deactivate,
    }
}
