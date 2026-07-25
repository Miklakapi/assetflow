<template>
    <Teleport to="body">
        <Transition name="application-side-panel">
            <div v-if="opened" class="application-side-panel-overlay" @click.self="close">
                <aside :style="{ width: props.width }" class="application-side-panel">
                    <slot />
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

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

let previousBodyOverflow = ''
let modalLayerRegistered = false

function close(): void {
    opened.value = false
}

function closeOnEscape(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !opened.value) {
        return
    }

    close()
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

    applicationUi.openModalLayer()
    modalLayerRegistered = true
}

function unregisterModalLayer(): void {
    if (!modalLayerRegistered) {
        return
    }

    applicationUi.closeModalLayer()
    modalLayerRegistered = false
}

watch(
    opened,
    (isOpened) => {
        if (isOpened) {
            lockBodyScroll()
            registerModalLayer()

            return
        }

        unlockBodyScroll()
        unregisterModalLayer()
    },
    {
        immediate: true,
    },
)

document.addEventListener('keydown', closeOnEscape)

onBeforeUnmount(() => {
    document.removeEventListener('keydown', closeOnEscape)
    unlockBodyScroll()
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
