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

        <AppSidePanel v-model:opened="panelOpened" width="440px">
            <div class="application-notifications-panel">
                <header class="application-notifications-header">
                    <div>
                        <div class="application-notifications-title">Notifications</div>

                        <div class="application-notifications-summary">{{ notifications.unreadCount }} unread</div>
                    </div>

                    <div class="application-notifications-header-actions">
                        <button
                            v-if="notifications.unreadCount"
                            class="application-notifications-header-button"
                            type="button"
                            @click="notifications.markAllAsRead"
                        >
                            Mark all as read
                        </button>

                        <button
                            v-if="notifications.items.length"
                            class="application-notifications-header-button application-notifications-clear"
                            type="button"
                            @click="clearNotifications"
                        >
                            Clear all
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
                        :class="{
                            'application-notification-unread': !notification.isRead,
                            'application-notification-expanded': isNotificationExpanded(notification.id),
                        }"
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

                                <span
                                    v-if="notification.details && isNotificationExpanded(notification.id)"
                                    class="application-notification-details"
                                >
                                    {{ notification.details }}
                                </span>
                            </span>

                            <span v-if="!notification.isRead" class="application-notification-indicator"></span>
                        </button>

                        <button
                            class="application-notification-remove"
                            type="button"
                            @click="removeNotification(notification.id)"
                        >
                            <X :size="15" />
                        </button>

                        <div class="application-notification-actions">
                            <button
                                v-if="hasExpandableContent(notification)"
                                class="application-notification-action"
                                type="button"
                                @click="toggleNotificationDetails(notification.id)"
                            >
                                <ChevronUp v-if="isNotificationExpanded(notification.id)" :size="14" />

                                <ChevronDown v-else :size="14" />

                                {{ isNotificationExpanded(notification.id) ? 'Hide details' : 'Show details' }}
                            </button>

                            <span class="application-notification-actions-spacer"></span>

                            <button
                                class="application-notification-action"
                                type="button"
                                @click="copyNotification(notification)"
                            >
                                <Check v-if="copiedNotificationId === notification.id" :size="14" />

                                <Copy v-else :size="14" />

                                {{ copiedNotificationId === notification.id ? 'Copied' : 'Copy' }}
                            </button>

                            <RouterLink
                                v-if="notification.route"
                                :to="notification.route"
                                class="application-notification-action application-notification-open"
                                @click="handleNotificationLinkClick($event, notification.id)"
                            >
                                Open

                                <ArrowRight :size="14" />
                            </RouterLink>
                        </div>
                    </article>
                </div>

                <div v-else class="application-notifications-empty">
                    <BellOff :size="28" :stroke-width="1.7" />

                    <span>No notifications</span>
                </div>
            </div>
        </AppSidePanel>
    </div>
</template>

<script setup lang="ts">
import {
    ArrowRight,
    Bell,
    BellOff,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    CircleAlert,
    Copy,
    Info,
    TriangleAlert,
    X,
    type LucideIcon,
} from '@lucide/vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink } from 'vue-router'

import AppSidePanel from '@/components/AppSidePanel.vue'
import { useNotificationsStore, type NotificationItem, type NotificationType } from '@/stores/notifications'
import { copyText } from '@/utils/copyText'

const notifications = useNotificationsStore()

const panelOpened = ref(false)
const expandedNotificationIds = ref<number[]>([])
const copiedNotificationId = ref<number | null>(null)

const notificationIcons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    info: Info,
    warning: TriangleAlert,
    error: CircleAlert,
}

const formattedUnreadCount = computed(() => {
    return notifications.unreadCount > 99 ? '99+' : notifications.unreadCount
})

let copiedNotificationTimeout: number | null = null

function togglePanel(): void {
    const shouldOpen = !panelOpened.value

    if (shouldOpen) {
        notifications.clearToasts()
    }

    panelOpened.value = shouldOpen
}

function closePanel(): void {
    panelOpened.value = false
}

function hasExpandableContent(notification: NotificationItem): boolean {
    return Boolean(notification.details || notification.title.length > 48 || (notification.message?.length ?? 0) > 100)
}

function isNotificationExpanded(id: number): boolean {
    return expandedNotificationIds.value.includes(id)
}

function toggleNotificationDetails(id: number): void {
    if (isNotificationExpanded(id)) {
        expandedNotificationIds.value = expandedNotificationIds.value.filter((notificationId) => notificationId !== id)

        return
    }

    expandedNotificationIds.value.push(id)
}

function removeNotification(id: number): void {
    expandedNotificationIds.value = expandedNotificationIds.value.filter((notificationId) => notificationId !== id)

    if (copiedNotificationId.value === id) {
        copiedNotificationId.value = null
    }

    notifications.removeNotification(id)
}

function clearNotifications(): void {
    expandedNotificationIds.value = []
    copiedNotificationId.value = null

    notifications.clearNotifications()
}

async function copyNotification(notification: NotificationItem): Promise<void> {
    const content = formatNotificationForClipboard(notification)
    const wasCopied = await copyText(content)

    if (!wasCopied) {
        return
    }

    copiedNotificationId.value = notification.id

    if (copiedNotificationTimeout !== null) {
        window.clearTimeout(copiedNotificationTimeout)
    }

    copiedNotificationTimeout = window.setTimeout(() => {
        copiedNotificationId.value = null
        copiedNotificationTimeout = null
    }, 1_600)
}

function formatNotificationForClipboard(notification: NotificationItem): string {
    const content = [`[${notification.type.toUpperCase()}] ${notification.title}`]

    if (notification.message) {
        content.push('', notification.message)
    }

    if (notification.details) {
        content.push('', notification.details)
    }

    return content.join('\n')
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

onBeforeUnmount(() => {
    if (copiedNotificationTimeout !== null) {
        window.clearTimeout(copiedNotificationTimeout)
    }
})
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
    gap: 4px;
}

.application-notifications-header-button {
    min-height: 30px;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-primary);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
}

.application-notifications-header-button:hover {
    background: var(--color-surface-active);
}

.application-notifications-clear {
    color: var(--color-error);
}

.application-notifications-clear:hover {
    background: color-mix(in srgb, var(--color-error) 8%, transparent);
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
    grid-template-columns: minmax(0, 1fr) 30px;
    grid-template-areas:
        'content remove'
        'actions actions';
    align-items: start;
    padding: 4px 10px 5px 6px;
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
    grid-area: content;
    grid-template-columns: 40px minmax(0, 1fr) 8px;
    align-items: start;
    gap: 10px;
    padding: 10px 6px 6px 10px;
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

.application-notification-details {
    display: block;
    max-height: 180px;
    margin-top: 8px;
    padding: 8px;
    overflow: auto;
    border: 1px solid color-mix(in srgb, var(--notification-color, var(--color-error)) 18%, transparent);
    border-radius: 7px;
    background: color-mix(in srgb, var(--notification-color, var(--color-error)) 5%, var(--color-surface));
    color: var(--color-text-muted);
    font-family: monospace;
    font-size: 11px;
    line-height: 16px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.application-notification-expanded .application-notification-title {
    overflow: visible;
    text-overflow: initial;
    white-space: normal;
}

.application-notification-expanded .application-notification-message {
    display: block;
    overflow: visible;
    line-clamp: initial;
    -webkit-line-clamp: initial;
}

.application-notification-indicator {
    width: 7px;
    height: 7px;
    margin-top: 5px;
    border-radius: 50%;
    background: var(--color-primary);
}

.application-notification-remove {
    display: flex;
    grid-area: remove;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    margin-top: 9px;
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

.application-notification-actions {
    display: flex;
    min-width: 0;
    grid-area: actions;
    align-items: center;
    gap: 4px;
    margin: 0 0 2px 60px;
}

.application-notification-actions-spacer {
    flex: 1;
}

.application-notification-action {
    display: flex;
    min-height: 28px;
    align-items: center;
    gap: 4px;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-primary);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
}

.application-notification-action:hover {
    background: var(--color-surface-active);
}

.application-notification-open {
    font-weight: 650;
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
