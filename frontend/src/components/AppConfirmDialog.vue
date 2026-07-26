<template>
    <AppDialog v-model:opened="opened" type="modal" :title="confirm.item?.title ?? 'Confirm action'" width="440px">
        <p class="app-confirm-dialog-message">
            {{ confirm.item?.message }}
        </p>

        <template #footer>
            <AppButton preset="secondary" @click="confirm.cancel">
                {{ confirm.item?.cancelLabel }}
            </AppButton>

            <AppButton preset="danger" @click="confirm.confirm">
                {{ confirm.item?.confirmLabel }}
            </AppButton>
        </template>
    </AppDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import AppButton from '@/components/AppButton.vue'
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
</style>
