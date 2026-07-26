<template>
    <div class="application-notifications">
        <AppButton
            :class="{ 'application-notifications-button-active': panelOpened }"
            class="application-notifications-button"
            icon-only
            label="Notifications"
            preset="ghost"
            size="small"
            @click="togglePanel"
        >
            <Bell :size="17" />

            <span v-if="notifications.unreadCount" class="application-notifications-badge">
                {{ formattedUnreadCount }}
            </span>
        </AppButton>

        <AppSidePanel v-model:opened="panelOpened" width="440px">
            <div class="application-notifications-panel">
                <header class="application-notifications-header">
                    <div>
                        <div class="application-notifications-title">Notifications</div>

                        <div class="application-notifications-summary">{{ notifications.unreadCount }} unread</div>
                    </div>

                    <div class="application-notifications-header-actions">
                        <AppButton
                            v-if="notifications.unreadCount"
                            class="application-notifications-header-button"
                            preset="ghost"
                            size="small"
                            @click="notifications.markAllAsRead"
                        >
                            Mark all as read
                        </AppButton>

                        <AppButton
                            v-if="notifications.items.length"
                            class="application-notifications-header-button application-notifications-clear"
                            preset="ghost"
                            size="small"
                            @click="clearNotifications"
                        >
                            Clear all
                        </AppButton>

                        <AppButton
                            class="application-notifications-close"
                            icon-only
                            label="Close notifications"
                            preset="ghost"
                            size="small"
                            @click="closePanel"
                        >
                            <X :size="18" />
                        </AppButton>
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
                        <AppButton
                            class="application-notification-read"
                            preset="ghost"
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
                        </AppButton>

                        <AppButton
                            class="application-notification-remove"
                            icon-only
                            label="Remove notification"
                            preset="ghost"
                            size="small"
                            @click="removeNotification(notification.id)"
                        >
                            <X :size="15" />
                        </AppButton>

                        <div class="application-notification-actions">
                            <AppButton
                                v-if="hasExpandableContent(notification)"
                                class="application-notification-action"
                                preset="ghost"
                                size="small"
                                @click="toggleNotificationDetails(notification.id)"
                            >
                                <ChevronUp v-if="isNotificationExpanded(notification.id)" :size="14" />

                                <ChevronDown v-else :size="14" />

                                {{ isNotificationExpanded(notification.id) ? 'Hide details' : 'Show details' }}
                            </AppButton>

                            <span class="application-notification-actions-spacer"></span>

                            <AppButton
                                class="application-notification-action"
                                preset="ghost"
                                size="small"
                                @click="copyNotification(notification)"
                            >
                                <Copy :size="14" />

                                Copy
                            </AppButton>

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
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import AppSidePanel from '@/components/AppSidePanel.vue'
import { useFeedbackStore } from '@/stores/feedback'
import { useNotificationsStore, type NotificationItem, type NotificationType } from '@/stores/notifications'
import { copyText } from '@/utils/copyText'

const notifications = useNotificationsStore()
const feedback = useFeedbackStore()

const panelOpened = ref(false)
const expandedNotificationIds = ref<number[]>([])

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

    notifications.removeNotification(id)
}

function clearNotifications(): void {
    expandedNotificationIds.value = []

    notifications.clearNotifications()
}

async function copyNotification(notification: NotificationItem): Promise<void> {
    const content = formatNotificationForClipboard(notification)
    const wasCopied = await copyText(content)

    if (!wasCopied) {
        return
    }

    feedback.show('Copied')
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
</script>

<style scoped>
.application-notifications {
    display: flex;
}

.application-notifications-button {
    position: relative;
    width: 32px;
    min-height: 32px;
    color: var(--color-text-muted);
}

.application-notifications-button :deep(.app-button-content) {
    position: static;
    width: 17px;
    height: 17px;
}

.application-notifications-button :deep(.app-button-content > svg) {
    display: block;
    flex-shrink: 0;
    color: currentColor;
}

.application-notifications-button:hover:not(:disabled),
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
    color: var(--color-primary);
}

.application-notifications-header-button:hover:not(:disabled) {
    background: var(--color-surface-active);
    color: var(--color-primary);
}

.application-notifications-clear {
    color: var(--color-error);
}

.application-notifications-clear:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-error) 8%, transparent);
    color: var(--color-error);
}

.application-notifications-close {
    width: 32px;
    min-height: 32px;
    color: var(--color-text-muted);
}

.application-notifications-close:hover:not(:disabled) {
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
    min-width: 0;
    min-height: 0;
    grid-area: content;
    justify-content: stretch;
    padding: 10px 6px 6px 10px;
    color: var(--color-text);
    text-align: left;
    white-space: normal;
}

.application-notification-read:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-text) 4%, transparent);
    color: var(--color-text);
    filter: none;
}

.application-notification-read :deep(.app-button-content) {
    display: grid;
    width: 100%;
    min-width: 0;
    grid-template-columns: 40px minmax(0, 1fr) 8px;
    align-items: start;
    gap: 10px;
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
    grid-area: remove;
    width: 30px;
    min-height: 30px;
    margin-top: 9px;
    color: var(--color-text-subtle);
}

.application-notification-remove:hover:not(:disabled) {
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
    min-height: 28px;
    color: var(--color-primary);
    font-size: 11px;
    font-weight: 600;
    text-decoration: none;
}

.application-notification-action:hover:not(:disabled) {
    background: var(--color-surface-active);
    color: var(--color-primary);
    filter: none;
}

.application-notification-open {
    display: flex;
    min-height: 28px;
    align-items: center;
    gap: 4px;
    padding: 0 7px;
    border-radius: 6px;
    font-weight: 650;
}

.application-notification-open:hover {
    background: var(--color-surface-active);
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
