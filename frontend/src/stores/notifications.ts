import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export interface ToastItem {
    id: number
    type: NotificationType
    title: string
    message: string | null
    duration: number
}

export interface NotificationItem {
    id: number
    type: NotificationType
    title: string
    message: string | null
    route: string | null
    createdAt: string
    isRead: boolean
}

export interface NotificationOptions {
    message?: string
    duration?: number
    save?: boolean
    route?: string
}

interface AddNotificationOptions extends NotificationOptions {
    type: NotificationType
    title: string
}

const defaultDuration = 4_000

export const useNotificationsStore = defineStore('notifications', () => {
    const toasts = ref<ToastItem[]>([])
    const items = ref<NotificationItem[]>([])

    const unreadCount = computed(() => {
        return items.value.filter((item) => !item.isRead).length
    })

    let nextToastId = 1
    let nextNotificationId = 1

    const toastTimeouts = new Map<number, number>()

    function success(title: string, options: NotificationOptions = {}): void {
        add({
            ...options,
            type: 'success',
            title,
        })
    }

    function info(title: string, options: NotificationOptions = {}): void {
        add({
            ...options,
            type: 'info',
            title,
        })
    }

    function warning(title: string, options: NotificationOptions = {}): void {
        add({
            ...options,
            type: 'warning',
            title,
        })
    }

    function error(title: string, options: NotificationOptions = {}): void {
        add({
            ...options,
            type: 'error',
            title,
        })
    }

    function removeToast(id: number): void {
        const timeout = toastTimeouts.get(id)

        if (timeout !== undefined) {
            window.clearTimeout(timeout)
            toastTimeouts.delete(id)
        }

        const index = toasts.value.findIndex((toast) => toast.id === id)

        if (index === -1) {
            return
        }

        toasts.value.splice(index, 1)
    }

    function clearToasts(): void {
        for (const timeout of toastTimeouts.values()) {
            window.clearTimeout(timeout)
        }

        toastTimeouts.clear()
        toasts.value = []
    }

    function markAsRead(id: number): void {
        const notification = items.value.find((item) => item.id === id)

        if (!notification) {
            return
        }

        notification.isRead = true
    }

    function markAllAsRead(): void {
        for (const notification of items.value) {
            notification.isRead = true
        }
    }

    function removeNotification(id: number): void {
        const index = items.value.findIndex((item) => item.id === id)

        if (index === -1) {
            return
        }

        items.value.splice(index, 1)
    }

    function clearNotifications(): void {
        items.value = []
    }

    function add(options: AddNotificationOptions): void {
        addToast(options)

        if (options.save) {
            saveNotification(options)
        }
    }

    function addToast(options: AddNotificationOptions): void {
        const id = nextToastId
        const duration = options.duration ?? defaultDuration

        nextToastId += 1

        toasts.value.push({
            id,
            type: options.type,
            title: options.title,
            message: options.message ?? null,
            duration,
        })

        if (duration <= 0) {
            return
        }

        const timeout = window.setTimeout(() => {
            removeToast(id)
        }, duration)

        toastTimeouts.set(id, timeout)
    }

    function saveNotification(options: AddNotificationOptions): void {
        items.value.unshift({
            id: nextNotificationId,
            type: options.type,
            title: options.title,
            message: options.message ?? null,
            route: options.route ?? null,
            createdAt: new Date().toISOString(),
            isRead: false,
        })

        nextNotificationId += 1
    }

    return {
        toasts,
        items,
        unreadCount,
        success,
        info,
        warning,
        error,
        removeToast,
        clearToasts,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearNotifications,
    }
})
