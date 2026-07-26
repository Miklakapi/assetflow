import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ConfirmOptions {
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
}

export interface ConfirmItem {
    title: string
    message: string
    confirmLabel: string
    cancelLabel: string
}

const defaultOptions: ConfirmItem = {
    title: 'Confirm action',
    message: 'Are you sure you want to continue?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
}

export const useConfirmStore = defineStore('confirm', () => {
    const item = ref<ConfirmItem | null>(null)

    let resolveConfirmation: ((confirmed: boolean) => void) | null = null

    function open(options: ConfirmOptions = {}): Promise<boolean> {
        close(false)

        item.value = {
            ...defaultOptions,
            ...options,
        }

        return new Promise((resolve) => {
            resolveConfirmation = resolve
        })
    }

    function confirm(): void {
        close(true)
    }

    function cancel(): void {
        close(false)
    }

    function close(confirmed: boolean): void {
        if (resolveConfirmation) {
            resolveConfirmation(confirmed)
            resolveConfirmation = null
        }

        item.value = null
    }

    return {
        item,
        open,
        confirm,
        cancel,
    }
})
