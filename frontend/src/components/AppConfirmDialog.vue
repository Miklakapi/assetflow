<template>
    <AppDialog v-model:opened="opened" type="modal" :title="confirm.item?.title ?? 'Confirm action'" width="440px">
        <p class="app-confirm-dialog-message">
            {{ confirm.item?.message }}
        </p>

        <template #footer>
            <button
                class="app-confirm-dialog-button app-confirm-dialog-button-cancel"
                type="button"
                @click="confirm.cancel"
            >
                {{ confirm.item?.cancelLabel }}
            </button>

            <button
                class="app-confirm-dialog-button app-confirm-dialog-button-confirm"
                type="button"
                @click="confirm.confirm"
            >
                {{ confirm.item?.confirmLabel }}
            </button>
        </template>
    </AppDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import AppDialog from '@/components/AppDialog.vue'
import { useConfirmStore } from '@/stores/confirm'

const confirm = useConfirmStore()

const opened = computed({
    get() {
        return confirm.item !== null
    },
    set(value: boolean) {
        if (!value) {
            confirm.cancel()
        }
    },
})
</script>

<style scoped>
.app-confirm-dialog-message {
    margin: 0;
    color: var(--color-text);
    font-size: 13px;
    line-height: 20px;
}

.app-confirm-dialog-button {
    min-height: 34px;
    padding: 0 13px;
    border: 1px solid transparent;
    border-radius: 7px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
}

.app-confirm-dialog-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.app-confirm-dialog-button-cancel {
    border-color: var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
}

.app-confirm-dialog-button-cancel:hover {
    background: var(--color-surface-hover);
}

.app-confirm-dialog-button-confirm {
    border-color: var(--color-error);
    background: var(--color-error);
    color: var(--color-white);
}

.app-confirm-dialog-button-confirm:hover {
    filter: brightness(0.94);
}
</style>
