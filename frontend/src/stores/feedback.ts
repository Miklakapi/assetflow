import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { NotificationType } from '@/stores/notifications'

export interface FeedbackItem {
    id: number
    type: NotificationType
    message: string
    x: number
    y: number
}

export interface FeedbackOptions {
    duration?: number
}

const defaultDuration = 600

export const useFeedbackStore = defineStore('feedback', () => {
    const item = ref<FeedbackItem | null>(null)

    let nextId = 1
    let feedbackTimeout: number | null = null
    let pointerX = window.innerWidth / 2
    let pointerY = 24

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
        clearFeedbackTimeout()

        item.value = {
            id: nextId,
            type,
            message,
            x: pointerX,
            y: pointerY,
        }

        nextId += 1

        feedbackTimeout = window.setTimeout(() => {
            clear()
        }, options.duration ?? defaultDuration)
    }

    function setPointerPosition(x: number, y: number): void {
        pointerX = x
        pointerY = y
    }

    function clear(): void {
        clearFeedbackTimeout()
        item.value = null
    }

    function clearFeedbackTimeout(): void {
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
        setPointerPosition,
        clear,
    }
})
