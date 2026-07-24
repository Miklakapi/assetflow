<template>
    <TransitionGroup class="notifications" name="notification" tag="div" aria-label="Notifications" aria-live="polite">
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
    z-index: 1000;
    top: 48px;
    right: 16px;
    display: flex;
    width: min(360px, calc(100vw - 32px));
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
}

.notification {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) 28px;
    align-items: start;
    gap: 8px;
    padding: 11px 10px;
    border: 1px solid currentColor;
    border-radius: 12px;
    box-shadow:
        0 10px 28px rgb(15 23 42 / 10%),
        inset 0 1px 0 rgb(255 255 255 / 70%);
    backdrop-filter: blur(14px) saturate(135%);
    -webkit-backdrop-filter: blur(14px) saturate(135%);
    pointer-events: auto;
}

.notification-icon {
    display: flex;
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
}

.notification-content {
    min-width: 0;
    padding-top: 1px;
}

.notification-title {
    overflow: hidden;
    font-size: 13px;
    font-weight: 650;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.notification-message {
    margin-top: 2px;
    color: #475569;
    font-size: 12px;
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
    border-radius: 7px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
}

.notification-close:hover {
    background: rgb(255 255 255 / 45%);
}

.notification-success {
    border-color: rgb(22 163 74 / 28%);
    background: rgb(240 253 244 / 80%);
    color: #16a34a;
}

.notification-info {
    border-color: rgb(37 99 235 / 28%);
    background: rgb(239 246 255 / 80%);
    color: #2563eb;
}

.notification-warning {
    border-color: rgb(217 119 6 / 28%);
    background: rgb(255 251 235 / 82%);
    color: #d97706;
}

.notification-error {
    border-color: rgb(220 38 38 / 28%);
    background: rgb(254 242 242 / 82%);
    color: #dc2626;
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

@media (prefers-reduced-motion: reduce) {
    .notification-enter-active,
    .notification-leave-active,
    .notification-move {
        transition: none;
    }
}
</style>
