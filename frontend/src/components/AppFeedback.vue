<template>
    <Teleport to="body">
        <div ref="popoverRef" class="app-feedback-popover" popover="manual">
            <Transition name="app-feedback" mode="out-in" @after-leave="handleAfterLeave">
                <div v-if="feedback.item" :key="feedback.item.id" class="app-feedback">
                    <Info :size="20" :stroke-width="2.2" class="app-feedback-icon" />

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
import { onBeforeUnmount, ref, watch } from 'vue'

import { useFeedbackStore } from '@/stores/feedback'

const feedback = useFeedbackStore()

const popoverRef = ref<HTMLElement | null>(null)

function openPopover(): void {
    const popover = popoverRef.value

    if (!feedback.item || !popover || popover.matches(':popover-open')) {
        return
    }

    popover.showPopover()
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

onBeforeUnmount(() => {
    hidePopover()
})
</script>

<style scoped>
.app-feedback-popover {
    position: fixed;
    inset: auto;
    top: calc(env(safe-area-inset-top) + 24px);
    left: 50%;
    width: max-content;
    max-width: calc(100vw - 32px);
    height: auto;
    margin: 0;
    padding: 0;
    overflow: visible;
    border: 0;
    background: transparent;
    pointer-events: none;
    transform: translateX(-50%);
}

.app-feedback {
    display: flex;
    max-width: min(520px, calc(100vw - 32px));
    min-height: 56px;
    align-items: center;
    gap: 12px;
    padding: 14px 22px;
    border: 1px solid color-mix(in srgb, var(--color-primary) 34%, transparent);
    border-radius: 16px;
    background:
        linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-primary) 13%, transparent),
            color-mix(in srgb, var(--color-primary) 5%, transparent)
        ),
        var(--color-surface);
    box-shadow:
        0 18px 44px rgb(var(--color-shadow) / 24%),
        0 0 0 3px color-mix(in srgb, var(--color-primary) 9%, transparent);
    color: var(--color-primary);
    pointer-events: none;
    transform-origin: top center;
}

.app-feedback-icon {
    flex-shrink: 0;
}

.app-feedback-message {
    overflow: hidden;
    color: var(--color-text-strong);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.app-feedback-enter-active {
    animation: app-feedback-enter 180ms ease-out;
}

.app-feedback-leave-active {
    transition:
        opacity 150ms ease,
        transform 150ms ease;
}

.app-feedback-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
}

@keyframes app-feedback-enter {
    from {
        opacity: 0;
        transform: translateY(-12px) scale(0.94);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media (max-width: 560px) {
    .app-feedback-popover {
        top: calc(env(safe-area-inset-top) + 12px);
    }

    .app-feedback {
        min-height: 50px;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 14px;
    }

    .app-feedback-message {
        font-size: 13px;
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
