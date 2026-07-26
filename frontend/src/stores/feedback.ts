import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface FeedbackItem {
    id: number
    message: string
    x: number
    y: number
}

export interface FeedbackOptions {
    duration?: number
}

const defaultDuration = 1500

export const useFeedbackStore = defineStore('feedback', () => {
    const item = ref<FeedbackItem | null>(null)

    let nextId = 1
    let feedbackTimeout: number | null = null
    let pointerX = window.innerWidth / 2
    let pointerY = 24

    function show(message: string, options: FeedbackOptions = {}): void {
        clearFeedbackTimeout()

        const id = nextId

        nextId += 1

        item.value = {
            id,
            message,
            x: pointerX,
            y: pointerY,
        }

        feedbackTimeout = window.setTimeout(() => {
            if (item.value?.id !== id) {
                return
            }

            feedbackTimeout = null
            item.value = null
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
        show,
        setPointerPosition,
        clear,
    }
})
