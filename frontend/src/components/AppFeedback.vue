<template>
    <Teleport to="body">
        <Transition name="app-feedback" mode="out-in">
            <div
                v-if="feedback.item"
                :key="feedback.item.id"
                :class="`app-feedback-${feedback.item.type}`"
                class="app-feedback"
            >
                <component
                    :is="feedbackIcons[feedback.item.type]"
                    :size="15"
                    :stroke-width="2.2"
                    class="app-feedback-icon"
                />

                <span class="app-feedback-message">
                    {{ feedback.item.message }}
                </span>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, CircleAlert, Info, TriangleAlert, type LucideIcon } from '@lucide/vue'

import { useFeedbackStore } from '@/stores/feedback'
import type { NotificationType } from '@/stores/notifications'

const feedback = useFeedbackStore()

const feedbackIcons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    info: Info,
    warning: TriangleAlert,
    error: CircleAlert,
}
</script>

<style scoped>
.app-feedback {
    position: fixed;
    z-index: 11000;
    top: 14px;
    left: 50%;
    display: flex;
    max-width: min(420px, calc(100vw - 32px));
    min-height: 32px;
    align-items: center;
    gap: 7px;
    padding: 6px 10px;
    border: 1px solid color-mix(in srgb, var(--feedback-color) 22%, transparent);
    border-radius: 8px;
    background:
        linear-gradient(
            color-mix(in srgb, var(--feedback-color) 8%, transparent),
            color-mix(in srgb, var(--feedback-color) 4%, transparent)
        ),
        color-mix(in srgb, var(--color-surface) 92%, transparent);
    box-shadow:
        0 8px 24px rgb(var(--color-shadow) / 14%),
        inset 0 1px 0 color-mix(in srgb, var(--color-white) 65%, transparent);
    color: var(--feedback-color);
    backdrop-filter: blur(8px) saturate(115%);
    -webkit-backdrop-filter: blur(8px) saturate(115%);
    pointer-events: none;
    transform: translateX(-50%);
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
    font-size: 12px;
    font-weight: 650;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.app-feedback-enter-active,
.app-feedback-leave-active {
    transition:
        opacity 140ms ease,
        transform 140ms ease;
}

.app-feedback-enter-from,
.app-feedback-leave-to {
    opacity: 0;
    transform: translate(-50%, -6px) scale(0.98);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .app-feedback {
        background: var(--color-surface);
    }
}

@media (prefers-reduced-motion: reduce) {
    .app-feedback-enter-active,
    .app-feedback-leave-active {
        transition: none;
    }
}
</style>
