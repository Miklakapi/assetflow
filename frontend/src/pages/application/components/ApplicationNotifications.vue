<template>
    <div class="application-notifications">
        <button
            :class="{ 'application-notifications-button-active': panelOpened }"
            class="application-notifications-button"
            type="button"
            @click="togglePanel"
        >
            <Bell :size="17" />

            <span v-if="notifications.unreadCount" class="application-notifications-badge">
                {{ formattedUnreadCount }}
            </span>
        </button>

        <ApplicationSidePanel v-model:opened="panelOpened" width="440px">
            <div class="application-notifications-panel">
                <header class="application-notifications-header">
                    <div>
                        <div class="application-notifications-title">Notifications</div>

                        <div class="application-notifications-summary">{{ notifications.unreadCount }} unread</div>
                    </div>

                    <div class="application-notifications-header-actions">
                        <button
                            v-if="notifications.unreadCount"
                            class="application-notifications-read-all"
                            type="button"
                            @click="notifications.markAllAsRead"
                        >
                            Mark all as read
                        </button>

                        <button class="application-notifications-close" type="button" @click="closePanel">
                            <X :size="18" />
                        </button>
                    </div>
                </header>

                <div v-if="notifications.items.length" class="application-notifications-list">
                    <article
                        v-for="notification in notifications.items"
                        :key="notification.id"
                        :class="{ 'application-notification-unread': !notification.isRead }"
                        class="application-notification"
                    >
                        <button
                            class="application-notification-read"
                            type="button"
                            @click="notifications.markAsRead(notification.id)"
                        >
                            <span
                                :class="`application-notification-icon-${notification.type}`"
                                class="application-notification-icon"
                            >
                                <component :is="notificationIcons[notification.type]" :size="18" :stroke-width="2" />
                            </span>

                            <span class="application-notification-content">
                                <span class="application-notification-top">
                                    <span class="application-notification-title">
                                        {{ notification.title }}
                                    </span>

                                    <span class="application-notification-time">
                                        {{ formatCreatedAt(notification.createdAt) }}
                                    </span>
                                </span>

                                <span v-if="notification.message" class="application-notification-message">
                                    {{ notification.message }}
                                </span>
                            </span>

                            <span v-if="!notification.isRead" class="application-notification-indicator"></span>
                        </button>

                        <RouterLink
                            v-if="notification.route"
                            :to="notification.route"
                            class="application-notification-open"
                            @click="handleNotificationLinkClick($event, notification.id)"
                        >
                            Open

                            <ArrowRight :size="14" />
                        </RouterLink>

                        <button
                            class="application-notification-remove"
                            type="button"
                            @click="notifications.removeNotification(notification.id)"
                        >
                            <X :size="15" />
                        </button>
                    </article>
                </div>

                <div v-else class="application-notifications-empty">
                    <BellOff :size="28" :stroke-width="1.7" />

                    <span>No notifications</span>
                </div>
            </div>
        </ApplicationSidePanel>
    </div>
</template>

<script setup lang="ts">
import {
    ArrowRight,
    Bell,
    BellOff,
    CheckCircle2,
    CircleAlert,
    Info,
    TriangleAlert,
    X,
    type LucideIcon,
} from '@lucide/vue'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import ApplicationSidePanel from '@/components/ApplicationSidePanel.vue'
import { useNotificationsStore, type NotificationType } from '@/stores/notifications'

const notifications = useNotificationsStore()

const panelOpened = ref(false)

const notificationIcons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    info: Info,
    warning: TriangleAlert,
    error: CircleAlert,
}

const formattedUnreadCount = computed(() => {
    return notifications.unreadCount > 99 ? '99+' : notifications.unreadCount
})

function togglePanel(): void {
    panelOpened.value = !panelOpened.value
}

function closePanel(): void {
    panelOpened.value = false
}

function handleNotificationLinkClick(event: MouseEvent, id: number): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
    }

    notifications.markAsRead(id)
    closePanel()
}

function formatCreatedAt(createdAt: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(createdAt))
}
</script>

<style scoped>
.application-notifications {
    display: flex;
}

.application-notifications-button {
    position: relative;
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
}

.application-notifications-button:hover,
.application-notifications-button-active {
    background: var(--color-surface-hover);
    color: var(--color-text-strong);
}

.application-notifications-badge {
    position: absolute;
    top: -3px;
    right: -5px;
    display: flex;
    min-width: 17px;
    height: 17px;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid var(--color-surface);
    border-radius: 9px;
    background: var(--color-error);
    color: var(--color-primary-contrast);
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
}

.application-notifications-panel {
    display: flex;
    height: 100%;
    flex-direction: column;
    background: var(--color-surface);
}

.application-notifications-header {
    display: flex;
    min-height: 72px;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--color-border);
}

.application-notifications-title {
    color: var(--color-text-strong);
    font-size: 16px;
    font-weight: 700;
}

.application-notifications-summary {
    margin-top: 2px;
    color: var(--color-text-subtle);
    font-size: 12px;
}

.application-notifications-header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
}

.application-notifications-read-all {
    min-height: 30px;
    padding: 0 8px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-primary);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
}

.application-notifications-read-all:hover {
    background: var(--color-surface-active);
}

.application-notifications-close {
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
}

.application-notifications-close:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-strong);
}

.application-notifications-list {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
}

.application-notification {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 4px;
    padding: 4px 10px 4px 6px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
}

.application-notification:hover {
    background: var(--color-surface-hover);
}

.application-notification-unread {
    background: color-mix(in srgb, var(--color-primary) 4%, var(--color-surface));
}

.application-notification-read {
    display: grid;
    min-width: 0;
    grid-template-columns: 40px minmax(0, 1fr) 8px;
    align-items: start;
    gap: 10px;
    padding: 10px 6px 10px 10px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--color-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.application-notification-read:hover {
    background: color-mix(in srgb, var(--color-text) 4%, transparent);
}

.application-notification-icon {
    display: flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: color-mix(in srgb, var(--notification-color) 10%, transparent);
    color: var(--notification-color);
}

.application-notification-icon-success {
    --notification-color: var(--color-success);
}

.application-notification-icon-info {
    --notification-color: var(--color-info);
}

.application-notification-icon-warning {
    --notification-color: var(--color-warning);
}

.application-notification-icon-error {
    --notification-color: var(--color-error);
}

.application-notification-content {
    display: block;
    min-width: 0;
}

.application-notification-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}

.application-notification-title {
    overflow: hidden;
    color: var(--color-text-strong);
    font-size: 13px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.application-notification-time {
    flex-shrink: 0;
    color: var(--color-text-subtle);
    font-size: 10px;
}

.application-notification-message {
    display: -webkit-box;
    margin-top: 3px;
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: 12px;
    line-height: 17px;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.application-notification-indicator {
    width: 7px;
    height: 7px;
    margin-top: 5px;
    border-radius: 50%;
    background: var(--color-primary);
}

.application-notification-open {
    display: flex;
    height: 30px;
    align-items: center;
    gap: 3px;
    padding: 0 8px;
    border-radius: 6px;
    color: var(--color-primary);
    font-size: 11px;
    font-weight: 650;
    text-decoration: none;
}

.application-notification-open:hover {
    background: var(--color-surface-active);
}

.application-notification-remove {
    display: flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-text-subtle);
    cursor: pointer;
}

.application-notification-remove:hover {
    background: color-mix(in srgb, var(--color-error) 8%, transparent);
    color: var(--color-error);
}

.application-notifications-empty {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--color-text-subtle);
    font-size: 12px;
}
</style>
