<template>
    <section class="home">
        <h1 class="home-title">Home</h1>

        <div class="home-section">
            <h2 class="home-section-title">Temporary notifications</h2>

            <div class="home-actions">
                <button class="home-button home-button-success" type="button" @click="showSuccess">Success</button>

                <button class="home-button home-button-info" type="button" @click="showInfo">Info</button>

                <button class="home-button home-button-warning" type="button" @click="showWarning">Warning</button>

                <button class="home-button home-button-error" type="button" @click="showError">Error</button>

                <button class="home-button home-button-error" type="button" @click="showLongError">Long error</button>
            </div>
        </div>

        <div class="home-section">
            <h2 class="home-section-title">Saved notifications</h2>

            <div class="home-actions">
                <button class="home-button home-button-success" type="button" @click="showSavedSuccess">
                    Saved success
                </button>

                <button class="home-button home-button-info" type="button" @click="showSavedInfo">Saved info</button>

                <button class="home-button home-button-warning" type="button" @click="showSavedWarning">
                    Saved warning
                </button>

                <button class="home-button home-button-error" type="button" @click="showSavedError">Saved error</button>

                <button class="home-button home-button-error" type="button" @click="showSavedLongError">
                    Saved long error
                </button>
            </div>
        </div>

        <div class="home-section">
            <h2 class="home-section-title">Dialogs</h2>

            <div class="home-actions">
                <button class="home-button home-button-primary" type="button" @click="dialogOpened = true">
                    Dialog
                </button>

                <button class="home-button home-button-primary" type="button" @click="modalOpened = true">Modal</button>

                <button class="home-button home-button-primary" type="button" @click="blockingDialogOpened = true">
                    Blocking
                </button>

                <button class="home-button home-button-primary" type="button" @click="sizedDialogOpened = true">
                    Custom size
                </button>

                <button class="home-button home-button-primary" type="button" @click="positionedDialogOpened = true">
                    Top position
                </button>

                <button class="home-button home-button-error" type="button" @click="errorDialogOpened = true">
                    Dialog with error
                </button>
            </div>
        </div>

        <AppDialog v-model:opened="dialogOpened" type="dialog" title="Product preview">
            <div class="popup-example">
                <p class="popup-example-text">
                    This dialog can be closed with Escape, the close button or by clicking the backdrop. It can also be
                    moved using its header.
                </p>
            </div>

            <template #footer>
                <button class="popup-button popup-button-primary" type="button" @click="dialogOpened = false">
                    Close
                </button>
            </template>
        </AppDialog>

        <AppDialog v-model:opened="modalOpened" type="modal" title="Edit product">
            <div class="popup-example">
                <p class="popup-example-text">
                    Clicking the backdrop does not close this modal. Escape and the close button remain available.
                </p>

                <label class="popup-example-field">
                    <span>Product name</span>

                    <input type="text" value="Example product" />
                </label>
            </div>

            <template #footer>
                <button class="popup-button popup-button-secondary" type="button" @click="modalOpened = false">
                    Cancel
                </button>

                <button class="popup-button popup-button-primary" type="button" @click="modalOpened = false">
                    Save
                </button>
            </template>
        </AppDialog>

        <AppDialog v-model:opened="blockingDialogOpened" type="blocking" title="Unsaved changes" width="480px">
            <div class="popup-example">
                <p class="popup-example-text">
                    This dialog cannot be closed by clicking the backdrop, pressing Escape or using a close button. One
                    of the actions below must be selected.
                </p>
            </div>

            <template #footer>
                <button class="popup-button popup-button-secondary" type="button" @click="blockingDialogOpened = false">
                    Continue editing
                </button>

                <button class="popup-button popup-button-primary" type="button" @click="blockingDialogOpened = false">
                    Leave without saving
                </button>
            </template>
        </AppDialog>

        <AppDialog v-model:opened="sizedDialogOpened" type="modal" title="Large dialog" width="820px" height="560px">
            <div class="popup-example">
                <p class="popup-example-text">
                    This dialog has an explicitly configured width and height. The content area should scroll when its
                    content becomes too large.
                </p>

                <p v-for="index in 15" :key="index" class="popup-example-row">Example content row {{ index }}</p>
            </div>

            <template #footer>
                <button class="popup-button popup-button-primary" type="button" @click="sizedDialogOpened = false">
                    Close
                </button>
            </template>
        </AppDialog>

        <AppDialog
            v-model:opened="positionedDialogOpened"
            type="modal"
            title="Top positioned dialog"
            width="560px"
            position="top"
        >
            <div class="popup-example">
                <p class="popup-example-text">
                    This dialog starts near the top of the screen and can still be moved freely using its header.
                </p>

                <button class="popup-button popup-button-secondary" type="button">Focusable action</button>
            </div>

            <template #footer>
                <button class="popup-button popup-button-primary" type="button" @click="positionedDialogOpened = false">
                    Done
                </button>
            </template>
        </AppDialog>

        <AppDialog v-model:opened="errorDialogOpened" type="modal" title="Save product" width="680px">
            <template #error>
                <div class="popup-error">
                    <CircleAlert :size="20" :stroke-width="2" />

                    <div class="popup-error-content">
                        <div class="popup-error-title">The product could not be saved</div>

                        <div class="popup-error-message">
                            The server rejected the request because the selected supplier is inactive and two required
                            asset fields are missing. Correct the highlighted values and try again.
                        </div>
                    </div>

                    <button class="popup-error-copy" type="button">
                        <Copy :size="15" />

                        Copy
                    </button>
                </div>
            </template>

            <div class="popup-example">
                <label class="popup-example-field">
                    <span>Product name</span>

                    <input type="text" value="Example product" />
                </label>

                <label class="popup-example-field">
                    <span>Supplier</span>

                    <input type="text" value="Inactive supplier" />
                </label>
            </div>

            <template #footer>
                <button class="popup-button popup-button-secondary" type="button" @click="errorDialogOpened = false">
                    Cancel
                </button>

                <button class="popup-button popup-button-primary" type="button">Try again</button>
            </template>
        </AppDialog>
    </section>
</template>

<script setup lang="ts">
import { CircleAlert, Copy } from '@lucide/vue'
import { ref } from 'vue'

import AppDialog from '@/components/AppDialog.vue'
import { useNotificationsStore } from '@/stores/notifications'

const notifications = useNotificationsStore()

const dialogOpened = ref(false)
const modalOpened = ref(false)
const blockingDialogOpened = ref(false)
const sizedDialogOpened = ref(false)
const positionedDialogOpened = ref(false)
const errorDialogOpened = ref(false)

function showSuccess(): void {
    notifications.success('Product saved', {
        message: 'The product was saved successfully.',
    })
}

function showInfo(): void {
    notifications.info('Import started', {
        message: 'The import is running in the background.',
    })
}

function showWarning(): void {
    notifications.warning('Missing information', {
        message: 'Some optional product fields are empty.',
    })
}

function showError(): void {
    notifications.error('Request failed', {
        message: 'The server could not process the request.',
    })
}

function showLongError(): void {
    notifications.error('The order synchronization request could not be completed successfully', {
        message:
            'The external system returned an unexpected response while synchronizing the order. Some related assets, reservation dates, assigned users and pricing information may not have been updated. Review the synchronization logs and try again after verifying the external service connection.',
        duration: 12_000,
    })
}

function showSavedSuccess(): void {
    notifications.success('Import completed', {
        message: '128 assets were imported successfully.',
        save: true,
        route: '/assets',
    })
}

function showSavedInfo(): void {
    notifications.info('Reservation created', {
        message: 'The reservation was added to the calendar.',
        save: true,
        route: '/reservations/calendar',
    })
}

function showSavedWarning(): void {
    notifications.warning('Asset inspection required', {
        message: 'One asset requires an inspection within seven days.',
        save: true,
        route: '/assets',
    })
}

function showSavedError(): void {
    notifications.error('Order synchronization failed', {
        message: 'The order could not be synchronized with the external system.',
        save: true,
        route: '/orders',
    })
}

function showSavedLongError(): void {
    notifications.error('Order synchronization failed because several related records could not be processed', {
        message:
            'The external system rejected the synchronization request because some assets referenced by the order no longer exist, several reservation dates overlap with existing reservations and one assigned user does not have permission to access the selected warehouse. Open the order to review all validation errors before attempting synchronization again.',
        duration: 12_000,
        save: true,
        route: '/orders',
    })
}
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.home-title {
    margin: 0;
    color: var(--color-text-strong);
    font-size: 20px;
    font-weight: 650;
}

.home-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border-radius: 12px;
    background: var(--color-surface);
}

.home-section-title {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 13px;
    font-weight: 650;
}

.home-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.home-button {
    min-height: 32px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: 7px;
    background: var(--color-surface);
    font-size: 13px;
    font-weight: 550;
    cursor: pointer;
}

.home-button:hover {
    filter: brightness(0.97);
}

.home-button-primary {
    border-color: color-mix(in srgb, var(--color-primary) 25%, transparent);
    background: color-mix(in srgb, var(--color-primary) 9%, transparent);
    color: var(--color-primary);
}

.home-button-success {
    border-color: color-mix(in srgb, var(--color-success) 25%, transparent);
    background: color-mix(in srgb, var(--color-success) 9%, transparent);
    color: var(--color-success);
}

.home-button-info {
    border-color: color-mix(in srgb, var(--color-info) 25%, transparent);
    background: color-mix(in srgb, var(--color-info) 9%, transparent);
    color: var(--color-info);
}

.home-button-warning {
    border-color: color-mix(in srgb, var(--color-warning) 25%, transparent);
    background: color-mix(in srgb, var(--color-warning) 9%, transparent);
    color: var(--color-warning);
}

.home-button-error {
    border-color: color-mix(in srgb, var(--color-error) 25%, transparent);
    background: color-mix(in srgb, var(--color-error) 9%, transparent);
    color: var(--color-error);
}

.popup-example {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.popup-example-text {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 13px;
    line-height: 20px;
}

.popup-example-row {
    margin: 0;
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    font-size: 13px;
}

.popup-example-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 600;
}

.popup-example-field input {
    height: 36px;
    padding: 0 10px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    outline: none;
    background: var(--color-surface);
    color: var(--color-text);
}

.popup-example-field input:focus {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.popup-button {
    min-height: 34px;
    padding: 0 13px;
    border: 1px solid transparent;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
}

.popup-button-primary {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: var(--color-primary-contrast);
}

.popup-button-primary:hover {
    background: var(--color-primary-hover);
}

.popup-button-secondary {
    border-color: var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
}

.popup-button-secondary:hover {
    background: var(--color-surface-hover);
}

.popup-error {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    align-items: start;
    gap: 10px;
    padding: 12px;
    border: 1px solid color-mix(in srgb, var(--color-error) 24%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, var(--color-error) 8%, transparent);
    color: var(--color-error);
}

.popup-error-content {
    min-width: 0;
}

.popup-error-title {
    color: var(--color-text-strong);
    font-size: 13px;
    font-weight: 700;
}

.popup-error-message {
    margin-top: 3px;
    color: var(--color-text);
    font-size: 12px;
    line-height: 18px;
}

.popup-error-copy {
    display: flex;
    min-height: 30px;
    align-items: center;
    gap: 4px;
    padding: 0 8px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-error);
    font-size: 11px;
    font-weight: 650;
    cursor: pointer;
}

.popup-error-copy:hover {
    background: color-mix(in srgb, var(--color-error) 9%, transparent);
}
</style>
