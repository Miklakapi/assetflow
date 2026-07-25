<template>
    <Teleport to="body">
        <Transition name="application-side-panel">
            <div v-if="opened" class="application-side-panel-overlay" @click.self="close">
                <aside ref="panelRef" :style="{ width: props.width }" class="application-side-panel" tabindex="-1">
                    <slot />
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useApplicationUiStore } from '@/stores/application-ui'

const applicationUi = useApplicationUiStore()

const props = withDefaults(
    defineProps<{
        width?: string
    }>(),
    {
        width: '420px',
    },
)

const opened = defineModel<boolean>('opened', {
    required: true,
})

const panelRef = ref<HTMLElement | null>(null)

let applicationElement: HTMLElement | null = null
let previouslyFocusedElement: HTMLElement | null = null
let previousBodyOverflow = ''
let applicationWasInert = false
let modalLayerRegistered = false
let modalLayerPosition = 0

const focusableElementSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',')

function close(): void {
    opened.value = false
}

function getFocusableElements(): HTMLElement[] {
    if (!panelRef.value) {
        return []
    }

    return Array.from(panelRef.value.querySelectorAll<HTMLElement>(focusableElementSelector)).filter(
        (element) => element.getClientRects().length > 0,
    )
}

function focusPanel(): void {
    const firstFocusableElement = getFocusableElements()[0]

    if (firstFocusableElement) {
        firstFocusableElement.focus()

        return
    }

    panelRef.value?.focus()
}

function trapFocus(event: KeyboardEvent): void {
    const focusableElements = getFocusableElements()
    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements.at(-1)
    const activeElement = document.activeElement

    if (!firstFocusableElement || !lastFocusableElement) {
        event.preventDefault()
        panelRef.value?.focus()

        return
    }

    if (event.shiftKey) {
        if (activeElement === firstFocusableElement || !panelRef.value?.contains(activeElement)) {
            event.preventDefault()
            lastFocusableElement.focus()
        }

        return
    }

    if (activeElement === lastFocusableElement || !panelRef.value?.contains(activeElement)) {
        event.preventDefault()
        firstFocusableElement.focus()
    }
}

function handleKeyboard(event: KeyboardEvent): void {
    if (!opened.value || applicationUi.activeModalLayers !== modalLayerPosition) {
        return
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        close()

        return
    }

    if (event.key === 'Tab') {
        trapFocus(event)
    }
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
}

function lockBodyScroll(): void {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
}

function unlockBodyScroll(): void {
    document.body.style.overflow = previousBodyOverflow
}

function registerModalLayer(): void {
    if (modalLayerRegistered) {
        return
    }

    previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null

    lockApplication()
    lockBodyScroll()

    applicationUi.openModalLayer()

    modalLayerPosition = applicationUi.activeModalLayers
    modalLayerRegistered = true

    nextTick(focusPanel)
}

function unregisterModalLayer(): void {
    if (!modalLayerRegistered) {
        return
    }

    unlockApplication()
    unlockBodyScroll()

    applicationUi.closeModalLayer()

    modalLayerRegistered = false
    modalLayerPosition = 0

    const elementToFocus = previouslyFocusedElement

    previouslyFocusedElement = null

    nextTick(() => {
        if (elementToFocus?.isConnected) {
            elementToFocus.focus()
        }
    })
}

watch(
    opened,
    (isOpened) => {
        if (isOpened) {
            registerModalLayer()

            return
        }

        unregisterModalLayer()
    },
    {
        immediate: true,
    },
)

onMounted(() => {
    document.addEventListener('keydown', handleKeyboard)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyboard)
    unregisterModalLayer()
})
</script>

<style scoped>
.application-side-panel-overlay {
    position: fixed;
    z-index: 9000;
    inset: 0;
    display: flex;
    justify-content: flex-end;
    background: color-mix(in srgb, var(--color-black) 32%, transparent);
}

.application-side-panel {
    width: min(100%, 420px);
    max-width: 100%;
    height: 100%;
    overflow: hidden;
    outline: none;
    background: var(--color-surface);
    box-shadow: -16px 0 48px rgb(var(--color-shadow) / 18%);
}

.application-side-panel-enter-active,
.application-side-panel-leave-active {
    transition: background 220ms ease;
}

.application-side-panel-enter-active .application-side-panel,
.application-side-panel-leave-active .application-side-panel {
    transition: transform 220ms ease;
}

.application-side-panel-enter-from,
.application-side-panel-leave-to {
    background: transparent;
}

.application-side-panel-enter-from .application-side-panel,
.application-side-panel-leave-to .application-side-panel {
    transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
    .application-side-panel-enter-active,
    .application-side-panel-leave-active,
    .application-side-panel-enter-active .application-side-panel,
    .application-side-panel-leave-active .application-side-panel {
        transition: none;
    }
}
</style>
