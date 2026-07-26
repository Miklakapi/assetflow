<template>
    <button
        :class="[
            `app-button-${props.preset}`,
            `app-button-${props.size}`,
            {
                'app-button-icon-only': props.iconOnly,
                'app-button-loading': isLoading,
            },
        ]"
        :type="props.type"
        :disabled="isDisabled"
        :aria-label="props.iconOnly ? props.label : undefined"
        :title="props.iconOnly ? props.label : undefined"
        class="app-button"
        @click="handleClick"
    >
        <span :class="{ 'app-button-content-hidden': isLoading }" class="app-button-content">
            <slot />
        </span>

        <AppSpinner v-if="isLoading" :size="spinnerSize" class="app-button-spinner" />
    </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import AppSpinner from '@/components/AppSpinner.vue'
import { useConfirmStore } from '@/stores/confirm'
import type { ConfirmOptions } from '@/stores/confirm'

const confirm = useConfirmStore()

const props = withDefaults(
    defineProps<{
        preset?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'ghost'
        size?: 'small' | 'medium' | 'large'
        type?: 'button' | 'submit' | 'reset'
        action?: (event: MouseEvent) => void | Promise<void>
        confirm?: boolean | ConfirmOptions
        loading?: boolean
        disabled?: boolean
        iconOnly?: boolean
        label?: string
    }>(),
    {
        preset: 'secondary',
        size: 'medium',
        type: 'button',
        action: undefined,
        confirm: false,
        loading: false,
        disabled: false,
        iconOnly: false,
        label: undefined,
    },
)

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const actionLoading = ref(false)

const isLoading = computed(() => {
    return props.loading || actionLoading.value
})

const isDisabled = computed(() => {
    return props.disabled || isLoading.value
})

const spinnerSize = computed(() => {
    switch (props.size) {
        case 'small':
            return 14

        case 'large':
            return 18

        default:
            return 16
    }
})

async function handleClick(event: MouseEvent): Promise<void> {
    if (isDisabled.value) {
        return
    }

    const confirmed = await confirmAction()

    if (!confirmed) {
        return
    }

    if (!props.action) {
        emit('click', event)

        return
    }

    actionLoading.value = true

    try {
        await props.action(event)
    } finally {
        actionLoading.value = false
    }
}

async function confirmAction(): Promise<boolean> {
    if (!props.confirm) {
        return true
    }

    if (props.confirm === true) {
        return confirm.open()
    }

    return confirm.open(props.confirm)
}
</script>

<style scoped>
.app-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 7px;
    font-family: inherit;
    font-weight: 650;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition:
        border-color 120ms ease,
        background-color 120ms ease,
        color 120ms ease,
        box-shadow 120ms ease,
        opacity 120ms ease;
}

.app-button:hover:not(:disabled) {
    filter: brightness(0.97);
}

.app-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.app-button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.app-button-small {
    min-height: 28px;
    padding: 0 9px;
    font-size: 11px;
}

.app-button-medium {
    min-height: 34px;
    padding: 0 13px;
    font-size: 12px;
}

.app-button-large {
    min-height: 40px;
    padding: 0 16px;
    font-size: 13px;
}

.app-button-icon-only.app-button-small {
    width: 28px;
    padding: 0;
}

.app-button-icon-only.app-button-medium {
    width: 34px;
    padding: 0;
}

.app-button-icon-only.app-button-large {
    width: 40px;
    padding: 0;
}

.app-button-primary {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: var(--color-primary-contrast);
}

.app-button-secondary {
    border-color: var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
}

.app-button-success {
    border-color: color-mix(in srgb, var(--color-success) 35%, transparent);
    background: color-mix(in srgb, var(--color-success) 10%, var(--color-surface));
    color: var(--color-success);
}

.app-button-info {
    border-color: color-mix(in srgb, var(--color-info) 35%, transparent);
    background: color-mix(in srgb, var(--color-info) 10%, var(--color-surface));
    color: var(--color-info);
}

.app-button-warning {
    border-color: color-mix(in srgb, var(--color-warning) 35%, transparent);
    background: color-mix(in srgb, var(--color-warning) 10%, var(--color-surface));
    color: var(--color-warning);
}

.app-button-danger {
    border-color: color-mix(in srgb, var(--color-error) 35%, transparent);
    background: color-mix(in srgb, var(--color-error) 10%, var(--color-surface));
    color: var(--color-error);
}

.app-button-ghost {
    border-color: transparent;
    background: transparent;
    color: var(--color-text-muted);
}

.app-button-ghost:hover:not(:disabled) {
    background: var(--color-surface-hover);
    color: var(--color-text);
    filter: none;
}

.app-button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.app-button-content-hidden {
    visibility: hidden;
}

.app-button-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

@media (prefers-reduced-motion: reduce) {
    .app-button {
        transition: none;
    }
}
</style>
