import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { NotificationType } from '@/stores/notifications'

export interface FeedbackItem {
    id: number
    type: NotificationType
    message: string
}

export interface FeedbackOptions {
    duration?: number
}

const defaultDuration = 1_600

export const useFeedbackStore = defineStore('feedback', () => {
    const item = ref<FeedbackItem | null>(null)

    let nextId = 1
    let feedbackTimeout: number | null = null

    function success(message: string, options: FeedbackOptions = {}): void {
        show('success', message, options)
    }

    function info(message: string, options: FeedbackOptions = {}): void {
        show('info', message, options)
    }

    function warning(message: string, options: FeedbackOptions = {}): void {
        show('warning', message, options)
    }

    function error(message: string, options: FeedbackOptions = {}): void {
        show('error', message, options)
    }

    function show(type: NotificationType, message: string, options: FeedbackOptions = {}): void {
        clearTimeout()

        item.value = {
            id: nextId,
            type,
            message,
        }

        nextId += 1

        feedbackTimeout = window.setTimeout(() => {
            clear()
        }, options.duration ?? defaultDuration)
    }

    function clear(): void {
        clearTimeout()
        item.value = null
    }

    function clearTimeout(): void {
        if (feedbackTimeout === null) {
            return
        }

        window.clearTimeout(feedbackTimeout)
        feedbackTimeout = null
    }

    return {
        item,
        success,
        info,
        warning,
        error,
        clear,
    }
})
