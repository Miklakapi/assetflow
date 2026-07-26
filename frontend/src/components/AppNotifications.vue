<template>
    <Teleport to="body">
        <TransitionGroup class="notifications" name="notification" tag="div">
            <article
                v-for="toast in notifications.toasts"
                :key="toast.id"
                :class="`notification-${toast.type}`"
                class="notification"
            >
                <div class="notification-icon">
                    <component :is="notificationIcons[toast.type]" :size="20" :stroke-width="2" />
                </div>

                <div class="notification-content">
                    <div class="notification-title">
                        {{ toast.title }}
                    </div>

                    <div v-if="toast.message" class="notification-message">
                        {{ toast.message }}
                    </div>

                    <pre v-if="toast.details" class="notification-details">{{ toast.details }}</pre>
                </div>

                <AppButton
                    class="notification-close"
                    icon-only
                    label="Close notification"
                    preset="ghost"
                    size="small"
                    @click="notifications.removeToast(toast.id)"
                >
                    <X :size="17" />
                </AppButton>
            </article>
        </TransitionGroup>
    </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X, type LucideIcon } from '@lucide/vue'

import AppButton from '@/components/AppButton.vue'
import { useNotificationsStore, type NotificationType } from '@/stores/notifications'

const notifications = useNotificationsStore()

const notificationIcons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    info: Info,
    warning: TriangleAlert,
    error: CircleAlert,
}
</script>

<style scoped>
.notifications {
    position: fixed;
    z-index: 10000;
    top: 64px;
    right: 16px;
    display: flex;
    width: min(380px, calc(100vw - 32px));
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.notification {
    position: relative;
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) 28px;
    align-items: start;
    gap: 10px;
    overflow: hidden;
    padding: 12px 11px;
    border: 1px solid color-mix(in srgb, var(--notification-color) 18%, transparent);
    border-radius: 16px;
    background:
        linear-gradient(
            color-mix(in srgb, var(--notification-color) 17%, transparent),
            color-mix(in srgb, var(--notification-color) 7%, transparent)
        ),
        color-mix(in srgb, var(--color-surface) 65%, transparent);
    box-shadow:
        0 14px 36px rgb(var(--color-shadow) / 14%),
        inset 0 1px 0 color-mix(in srgb, var(--color-surface) 82%, transparent);
    color: var(--notification-color);
    backdrop-filter: blur(4px) saturate(115%);
    -webkit-backdrop-filter: blur(4px) saturate(115%);
    pointer-events: auto;
}

.notification::after {
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 0;
    width: 4px;
    border-radius: 0 4px 4px 0;
    background: currentColor;
    content: '';
    pointer-events: none;
}

.notification-icon,
.notification-content,
.notification-close {
    position: relative;
    z-index: 1;
}

.notification-icon {
    display: flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border: 1px solid color-mix(in srgb, var(--notification-color) 24%, transparent);
    border-radius: 11px;
    background: color-mix(in srgb, var(--notification-color) 8%, transparent);
}

.notification-content {
    min-width: 0;
    padding-top: 1px;
}

.notification-title {
    overflow: hidden;
    color: var(--color-text-strong);
    font-size: 14px;
    font-weight: 700;
    line-height: 19px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.notification-message {
    margin-top: 2px;
    color: var(--color-text);
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
}

.notification-details {
    max-height: 140px;
    margin: 6px 0 0;
    padding: 8px;
    overflow: auto;
    border: 1px solid color-mix(in srgb, var(--notification-color) 18%, transparent);
    border-radius: 7px;
    background: color-mix(in srgb, var(--notification-color) 5%, var(--color-surface));
    color: var(--color-text-muted);
    font-family: monospace;
    font-size: 11px;
    line-height: 16px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.notification-close {
    width: 28px;
    min-height: 28px;
    color: var(--notification-color);
}

.notification-close:hover:not(:disabled) {
    background: color-mix(in srgb, var(--notification-color) 8%, transparent);
    color: var(--notification-color);
    filter: none;
}

.notification-close:focus-visible {
    box-shadow: none;
    outline: 2px solid color-mix(in srgb, var(--notification-color) 40%, transparent);
    outline-offset: 2px;
}

.notification-close :deep(svg) {
    color: var(--notification-color);
}

.notification-success {
    --notification-color: var(--color-success);
}

.notification-info {
    --notification-color: var(--color-info);
}

.notification-warning {
    --notification-color: var(--color-warning);
}

.notification-error {
    --notification-color: var(--color-error);
}

.notification-enter-active,
.notification-leave-active,
.notification-move {
    transition:
        opacity 180ms ease,
        transform 180ms ease;
}

.notification-enter-from,
.notification-leave-to {
    opacity: 0;
    transform: translateX(18px) scale(0.98);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .notification {
        background:
            linear-gradient(
                color-mix(in srgb, var(--notification-color) 6%, transparent),
                color-mix(in srgb, var(--notification-color) 6%, transparent)
            ),
            color-mix(in srgb, var(--color-surface-subtle) 94%, transparent);
    }
}

@media (prefers-reduced-motion: reduce) {
    .notification-enter-active,
    .notification-leave-active,
    .notification-move {
        transition: none;
    }
}
</style>
