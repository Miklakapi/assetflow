<template>
    <Teleport to="body">
        <TransitionGroup
            class="notifications"
            name="notification"
            tag="div"
            aria-label="Notifications"
            aria-live="polite"
        >
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
                </div>

                <button
                    class="notification-close"
                    type="button"
                    aria-label="Close notification"
                    @click="notifications.removeToast(toast.id)"
                >
                    <X :size="17" />
                </button>
            </article>
        </TransitionGroup>
    </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X, type LucideIcon } from '@lucide/vue'

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
    width: min(360px, calc(100vw - 32px));
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
    border: 1px solid rgb(255 255 255 / 68%);
    border-radius: 16px;
    background: rgb(255 255 255 / 65%);
    box-shadow:
        0 14px 36px rgb(15 23 42 / 14%),
        inset 0 1px 0 rgb(255 255 255 / 82%);
    color: rgb(var(--notification-color));
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
    border: 1px solid rgb(var(--notification-color) / 24%);
    border-radius: 11px;
    background: rgb(var(--notification-color) / 8%);
}

.notification-content {
    min-width: 0;
    padding-top: 1px;
}

.notification-title {
    overflow: hidden;
    color: #0f172a;
    font-size: 14px;
    font-weight: 700;
    line-height: 19px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.notification-message {
    margin-top: 2px;
    color: #334155;
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
}

.notification-close {
    display: flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
}

.notification-close:hover {
    background: rgb(var(--notification-color) / 8%);
}

.notification-close:focus-visible {
    outline: 2px solid rgb(var(--notification-color) / 40%);
    outline-offset: 2px;
}

.notification-success {
    --notification-color: 22 163 74;
}

.notification-info {
    --notification-color: 37 99 235;
}

.notification-warning {
    --notification-color: 217 119 6;
}

.notification-error {
    --notification-color: 220 38 38;
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
        background: rgb(248 250 252 / 94%);
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
