<template>
    <Teleport to="body">
        <div ref="popoverRef" :style="popoverStyle" class="app-feedback-popover" popover="manual">
            <Transition
                name="app-feedback"
                mode="out-in"
                @before-enter="prepareFeedbackPosition"
                @after-enter="correctFeedbackPosition"
                @after-leave="handleAfterLeave"
            >
                <div v-if="feedback.item" ref="feedbackRef" :key="feedback.item.id" class="app-feedback">
                    <Info :size="14" :stroke-width="2.2" class="app-feedback-icon" />

                    <span class="app-feedback-message">
                        {{ feedback.item.message }}
                    </span>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { Info } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useFeedbackStore } from '@/stores/feedback'

const feedback = useFeedbackStore()

const popoverRef = ref<HTMLElement | null>(null)
const feedbackRef = ref<HTMLElement | null>(null)
const positionX = ref(0)
const positionY = ref(0)
const isTouchDevice = ref(false)

const touchDeviceMedia = window.matchMedia('(hover: none) and (pointer: coarse)')

const popoverStyle = computed(() => {
    if (isTouchDevice.value) {
        return {
            top: 'calc(env(safe-area-inset-top) + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
        }
    }

    return {
        left: `${positionX.value}px`,
        top: `${positionY.value}px`,
    }
})

function handlePointerMove(event: PointerEvent): void {
    if (isTouchDevice.value) {
        return
    }

    feedback.setPointerPosition(event.clientX, event.clientY)
}

function handleTouchDeviceChange(event: MediaQueryListEvent): void {
    isTouchDevice.value = event.matches
}

function openPopover(): void {
    const popover = popoverRef.value

    if (!feedback.item || !popover || popover.matches(':popover-open')) {
        return
    }

    popover.showPopover()
}

function prepareFeedbackPosition(): void {
    const item = feedback.item

    if (!item || isTouchDevice.value) {
        return
    }

    positionX.value = item.x + 12
    positionY.value = item.y + 12
}

async function correctFeedbackPosition(): Promise<void> {
    const item = feedback.item

    if (!item || isTouchDevice.value) {
        return
    }

    const itemId = item.id

    await nextTick()

    if (feedback.item?.id !== itemId) {
        return
    }

    const element = feedbackRef.value

    if (!element) {
        return
    }

    const rect = element.getBoundingClientRect()
    const viewportPadding = 8

    if (rect.right > window.innerWidth - viewportPadding) {
        positionX.value = item.x - rect.width - 12
    }

    if (rect.bottom > window.innerHeight - viewportPadding) {
        positionY.value = item.y - rect.height - 12
    }

    positionX.value = Math.max(viewportPadding, positionX.value)
    positionY.value = Math.max(viewportPadding, positionY.value)
}

function handleAfterLeave(): void {
    if (feedback.item) {
        return
    }

    hidePopover()
}

function hidePopover(): void {
    const popover = popoverRef.value

    if (!popover?.matches(':popover-open')) {
        return
    }

    popover.hidePopover()
}

watch(
    () => feedback.item?.id,
    (itemId) => {
        if (!itemId) {
            return
        }

        openPopover()
    },
)

onMounted(() => {
    isTouchDevice.value = touchDeviceMedia.matches

    window.addEventListener('pointermove', handlePointerMove, {
        passive: true,
    })

    touchDeviceMedia.addEventListener('change', handleTouchDeviceChange)
})

onBeforeUnmount(() => {
    window.removeEventListener('pointermove', handlePointerMove)
    touchDeviceMedia.removeEventListener('change', handleTouchDeviceChange)
    hidePopover()
})
</script>

<style scoped>
.app-feedback-popover {
    position: fixed;
    width: max-content;
    max-width: calc(100vw - 16px);
    height: auto;
    margin: 0;
    padding: 0;
    overflow: visible;
    border: 0;
    background: transparent;
    pointer-events: none;
}

.app-feedback {
    display: flex;
    max-width: min(280px, calc(100vw - 16px));
    min-height: 28px;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    border: 1px solid color-mix(in srgb, var(--color-primary) 28%, transparent);
    border-radius: 7px;
    background:
        linear-gradient(
            color-mix(in srgb, var(--color-primary) 8%, transparent),
            color-mix(in srgb, var(--color-primary) 3%, transparent)
        ),
        color-mix(in srgb, var(--color-surface) 96%, transparent);
    box-shadow:
        0 8px 20px rgb(var(--color-shadow) / 18%),
        0 0 0 2px color-mix(in srgb, var(--color-primary) 7%, transparent);
    color: var(--color-primary);
    backdrop-filter: blur(8px) saturate(120%);
    -webkit-backdrop-filter: blur(8px) saturate(120%);
    pointer-events: none;
    transform-origin: center;
}

.app-feedback-icon {
    flex-shrink: 0;
}

.app-feedback-message {
    overflow: hidden;
    color: var(--color-text-strong);
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.app-feedback-enter-active {
    animation: app-feedback-enter 150ms ease-out;
}

.app-feedback-leave-active {
    transition:
        opacity 160ms ease,
        transform 160ms ease;
}

.app-feedback-leave-to {
    opacity: 0;
    transform: scale(0.82);
}

@keyframes app-feedback-enter {
    from {
        opacity: 0;
        transform: translateY(4px) scale(0.94);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .app-feedback {
        background: var(--color-surface);
    }
}

@media (prefers-reduced-motion: reduce) {
    .app-feedback-enter-active {
        animation: none;
    }

    .app-feedback-leave-active {
        transition: none;
    }
}
</style>
