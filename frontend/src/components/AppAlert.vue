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
            <AppButton class="app-alert-action" preset="ghost" size="small" @click="copyAlert">
                <Copy :size="14" />

                Copy
            </AppButton>

            <AppButton
                v-if="props.dismissible"
                class="app-alert-action"
                icon-only
                label="Dismiss alert"
                preset="ghost"
                size="small"
                @click="emit('close')"
            >
                <X :size="14" />
            </AppButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CheckCircle2, CircleAlert, Copy, Info, TriangleAlert, X, type LucideIcon } from '@lucide/vue'

import AppButton from '@/components/AppButton.vue'
import { useFeedbackStore } from '@/stores/feedback'
import type { NotificationType } from '@/stores/notifications'
import { copyText } from '@/utils/copyText'

const feedback = useFeedbackStore()

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

const alertIcons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    info: Info,
    warning: TriangleAlert,
    error: CircleAlert,
}

async function copyAlert(): Promise<void> {
    const content = [props.title, props.message, props.details].filter(Boolean).join('\n\n')
    const wasCopied = await copyText(content)

    if (!wasCopied) {
        return
    }

    feedback.show('Copied')
}
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
    color: var(--alert-color);
}

.app-alert-action:hover:not(:disabled) {
    background: color-mix(in srgb, var(--alert-color) 9%, transparent);
    color: var(--alert-color);
}
</style>
