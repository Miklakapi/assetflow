<template>
    <div :class="`app-alert-${props.type}`" class="app-alert">
        <component :is="alertIcons[props.type]" :size="18" :stroke-width="2" class="app-alert-icon" />

        <div class="app-alert-content">
            <div class="app-alert-title">
                {{ props.title }}
            </div>

            <div v-if="props.message" class="app-alert-message">
                {{ props.message }}
            </div>

            <pre v-if="props.details" class="app-alert-details">{{ props.details }}</pre>
        </div>

        <div class="app-alert-actions">
            <button class="app-alert-action app-alert-copy" type="button" @click="copyAlert">
                <Check v-if="copied" :size="14" />

                <Copy v-else :size="14" />

                {{ copied ? 'Copied' : 'Copy' }}
            </button>

            <button
                v-if="props.dismissible"
                class="app-alert-action app-alert-close"
                type="button"
                @click="emit('close')"
            >
                <X :size="14" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Check, CheckCircle2, CircleAlert, Copy, Info, TriangleAlert, X, type LucideIcon } from '@lucide/vue'
import { onBeforeUnmount, ref } from 'vue'

import type { NotificationType } from '@/stores/notifications'
import { copyText } from '@/utils/copyText'

const props = withDefaults(
    defineProps<{
        type: NotificationType
        title: string
        message?: string
        details?: string
        dismissible?: boolean
    }>(),
    {
        message: undefined,
        details: undefined,
        dismissible: false,
    },
)

const emit = defineEmits<{
    close: []
}>()

const copied = ref(false)

const alertIcons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    info: Info,
    warning: TriangleAlert,
    error: CircleAlert,
}

let copiedTimeout: ReturnType<typeof setTimeout> | null = null

async function copyAlert(): Promise<void> {
    const content = [props.title, props.message, props.details].filter(Boolean).join('\n\n')
    const wasCopied = await copyText(content)

    copied.value = wasCopied

    if (!wasCopied) {
        return
    }

    if (copiedTimeout) {
        clearTimeout(copiedTimeout)
    }

    copiedTimeout = setTimeout(() => {
        copied.value = false
        copiedTimeout = null
    }, 2000)
}

onBeforeUnmount(() => {
    if (copiedTimeout) {
        clearTimeout(copiedTimeout)
    }
})
</script>

<style scoped>
.app-alert {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr) auto;
    align-items: start;
    gap: 8px;
    padding: 10px;
    border: 1px solid color-mix(in srgb, var(--alert-color) 24%, transparent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--alert-color) 7%, transparent);
    color: var(--alert-color);
}

.app-alert-success {
    --alert-color: var(--color-success);
}

.app-alert-info {
    --alert-color: var(--color-info);
}

.app-alert-warning {
    --alert-color: var(--color-warning);
}

.app-alert-error {
    --alert-color: var(--color-error);
}

.app-alert-icon {
    margin-top: 1px;
}

.app-alert-content {
    min-width: 0;
}

.app-alert-title {
    color: var(--color-text-strong);
    font-size: 13px;
    font-weight: 700;
    line-height: 18px;
}

.app-alert-message {
    margin-top: 2px;
    color: var(--color-text);
    font-size: 12px;
    line-height: 18px;
}

.app-alert-details {
    max-height: 160px;
    margin: 8px 0 0;
    padding: 8px;
    overflow: auto;
    border: 1px solid color-mix(in srgb, var(--alert-color) 18%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--alert-color) 5%, var(--color-surface));
    color: var(--color-text-muted);
    font-family: monospace;
    font-size: 11px;
    line-height: 16px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.app-alert-actions {
    display: flex;
    align-items: center;
    gap: 2px;
}

.app-alert-action {
    display: flex;
    min-height: 28px;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--alert-color);
    font-size: 11px;
    font-weight: 650;
    cursor: pointer;
}

.app-alert-action:hover {
    background: color-mix(in srgb, var(--alert-color) 9%, transparent);
}

.app-alert-close {
    width: 28px;
    padding: 0;
}
</style>
