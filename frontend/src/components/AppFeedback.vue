<template>
    <Teleport to="body">
        <div ref="popoverRef" :style="popoverStyle" class="app-feedback-popover" popover="manual">
            <Transition name="app-feedback" mode="out-in" @after-leave="hidePopover">
                <div
                    v-if="feedback.item"
                    ref="feedbackRef"
                    :key="feedback.item.id"
                    :class="`app-feedback-${feedback.item.type}`"
                    class="app-feedback"
                >
                    <component
                        :is="feedbackIcons[feedback.item.type]"
                        :size="14"
                        :stroke-width="2.2"
                        class="app-feedback-icon"
                    />

                    <span class="app-feedback-message">
                        {{ feedback.item.message }}
                    </span>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, CircleAlert, Info, TriangleAlert, type LucideIcon } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useFeedbackStore } from '@/stores/feedback'
import type { NotificationType } from '@/stores/notifications'

const feedback = useFeedbackStore()

const popoverRef = ref<HTMLElement | null>(null)
const feedbackRef = ref<HTMLElement | null>(null)
const positionX = ref(0)
const positionY = ref(0)

const feedbackIcons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    info: Info,
    warning: TriangleAlert,
    error: CircleAlert,
}

const popoverStyle = computed(() => {
    return {
        left: `${positionX.value}px`,
        top: `${positionY.value}px`,
    }
})

function handlePointerMove(event: PointerEvent): void {
    feedback.setPointerPosition(event.clientX, event.clientY)
}

async function showFeedback(): Promise<void> {
    const item = feedback.item
    const popover = popoverRef.value

    if (!item || !popover) {
        return
    }

    positionX.value = item.x + 12
    positionY.value = item.y + 12

    if (!popover.matches(':popover-open')) {
        popover.showPopover()
    }

    await nextTick()

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

        showFeedback()
    },
)

onMounted(() => {
    window.addEventListener('pointermove', handlePointerMove, {
        passive: true,
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('pointermove', handlePointerMove)
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
    border: 1px solid color-mix(in srgb, var(--feedback-color) 32%, transparent);
    border-radius: 7px;
    background:
        linear-gradient(
            color-mix(in srgb, var(--feedback-color) 10%, transparent),
            color-mix(in srgb, var(--feedback-color) 5%, transparent)
        ),
        color-mix(in srgb, var(--color-surface) 96%, transparent);
    box-shadow:
        0 8px 20px rgb(var(--color-shadow) / 18%),
        0 0 0 2px color-mix(in srgb, var(--feedback-color) 8%, transparent);
    color: var(--feedback-color);
    backdrop-filter: blur(8px) saturate(120%);
    -webkit-backdrop-filter: blur(8px) saturate(120%);
    pointer-events: none;
    transform-origin: center;
}

.app-feedback-success {
    --feedback-color: var(--color-success);
}

.app-feedback-info {
    --feedback-color: var(--color-info);
}

.app-feedback-warning {
    --feedback-color: var(--color-warning);
}

.app-feedback-error {
    --feedback-color: var(--color-error);
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
