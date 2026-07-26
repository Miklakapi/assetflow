<template>
    <Teleport to="body">
        <Transition name="application-side-panel">
            <div v-if="opened" class="application-side-panel-overlay" @click.self="close">
                <aside ref="panelRef" :style="{ width: width }" class="application-side-panel" tabindex="-1">
                    <slot />
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useFocusTrap } from '@/composables/useFocusTrap'
import { useModalLayer } from '@/composables/useModalLayer'

withDefaults(
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

const focusTrap = useFocusTrap(panelRef)
const modalLayer = useModalLayer()

function close(): void {
    opened.value = false
}

function handleKeyboard(event: KeyboardEvent): void {
    if (!opened.value || !modalLayer.isTopLayer.value) {
        return
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        close()

        return
    }

    focusTrap.handleKeydown(event)
}

watch(
    opened,
    async (isOpened) => {
        if (isOpened) {
            modalLayer.activate()
            await focusTrap.activate()

            return
        }

        focusTrap.deactivate()
        modalLayer.deactivate()
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
