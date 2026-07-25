<template>
    <div class="app-error">
        <CircleAlert :size="18" :stroke-width="2" class="app-error-icon" />

        <div class="app-error-content">
            <div class="app-error-title">
                {{ props.title }}
            </div>

            <div v-if="props.message" class="app-error-message">
                {{ props.message }}
            </div>

            <pre v-if="props.details" class="app-error-details">{{ props.details }}</pre>
        </div>

        <button class="app-error-copy" type="button" @click="copyError">
            <Check v-if="copied" :size="14" />

            <Copy v-else :size="14" />

            {{ copied ? 'Copied' : 'Copy' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { Check, CircleAlert, Copy } from '@lucide/vue'
import { ref } from 'vue'

const props = defineProps<{
    title: string
    message?: string
    details?: string
}>()

const copied = ref(false)

let copiedTimeout: ReturnType<typeof setTimeout> | null = null

async function copyError(): Promise<void> {
    const content = [props.title, props.message, props.details].filter(Boolean).join('\n\n')

    try {
        await navigator.clipboard.writeText(content)

        copied.value = true

        if (copiedTimeout) {
            clearTimeout(copiedTimeout)
        }

        copiedTimeout = setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch {
        copied.value = false
    }
}
</script>

<style scoped>
.app-error {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr) auto;
    align-items: start;
    gap: 8px;
    padding: 10px;
    border: 1px solid color-mix(in srgb, var(--color-error) 24%, transparent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--color-error) 7%, transparent);
    color: var(--color-error);
}

.app-error-icon {
    margin-top: 1px;
}

.app-error-content {
    min-width: 0;
}

.app-error-title {
    color: var(--color-text-strong);
    font-size: 13px;
    font-weight: 700;
    line-height: 18px;
}

.app-error-message {
    margin-top: 2px;
    color: var(--color-text);
    font-size: 12px;
    line-height: 18px;
}

.app-error-details {
    max-height: 160px;
    margin: 8px 0 0;
    padding: 8px;
    overflow: auto;
    border: 1px solid color-mix(in srgb, var(--color-error) 18%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--color-error) 5%, var(--color-surface));
    color: var(--color-text-muted);
    font-family: monospace;
    font-size: 11px;
    line-height: 16px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.app-error-copy {
    display: flex;
    min-height: 28px;
    align-items: center;
    gap: 4px;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-error);
    font-size: 11px;
    font-weight: 650;
    cursor: pointer;
}

.app-error-copy:hover {
    background: color-mix(in srgb, var(--color-error) 9%, transparent);
}
</style>
