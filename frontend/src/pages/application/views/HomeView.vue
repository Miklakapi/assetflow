<template>
    <section class="home">
        <h1 class="home-title">Home</h1>

        <div class="home-section">
            <h2 class="home-section-title">Spinner</h2>

            <div class="home-spinner-examples">
                <AppSpinner :size="14" />

                <AppSpinner :size="20" />

                <AppSpinner :size="28" :thickness="2.5" />

                <AppSpinner size="1em" />
            </div>
        </div>

        <div class="home-section">
            <h2 class="home-section-title">Buttons</h2>

            <div class="home-button-examples">
                <div class="home-button-example">
                    <span class="home-button-example-label">Presets</span>

                    <div class="home-actions">
                        <AppButton preset="primary" @click="showButtonFeedback('Primary clicked')">Primary</AppButton>

                        <AppButton preset="secondary" @click="showButtonFeedback('Secondary clicked')">
                            Secondary
                        </AppButton>

                        <AppButton preset="success" @click="showButtonFeedback('Success clicked')">Success</AppButton>

                        <AppButton preset="info" @click="showButtonFeedback('Info clicked')">Info</AppButton>

                        <AppButton preset="warning" @click="showButtonFeedback('Warning clicked')">Warning</AppButton>

                        <AppButton preset="danger" @click="showButtonFeedback('Danger clicked')">Danger</AppButton>

                        <AppButton preset="ghost" @click="showButtonFeedback('Ghost clicked')">Ghost</AppButton>
                    </div>
                </div>

                <div class="home-button-example">
                    <span class="home-button-example-label">Sizes</span>

                    <div class="home-actions home-actions-aligned">
                        <AppButton preset="primary" size="small">Small</AppButton>

                        <AppButton preset="primary" size="medium">Medium</AppButton>

                        <AppButton preset="primary" size="large">Large</AppButton>
                    </div>
                </div>

                <div class="home-button-example">
                    <span class="home-button-example-label">States</span>

                    <div class="home-actions">
                        <AppButton disabled>Disabled</AppButton>

                        <AppButton :loading="manualLoading" preset="secondary" @click="startManualLoading">
                            Controlled loading
                        </AppButton>

                        <AppButton :action="runAsyncAction" preset="primary">Automatic async action</AppButton>
                    </div>
                </div>

                <div class="home-button-example">
                    <span class="home-button-example-label">Confirmation</span>

                    <div class="home-actions">
                        <AppButton :action="runConfirmedAction" preset="danger" confirm>Default confirm</AppButton>

                        <AppButton
                            :action="runDeleteAction"
                            :confirm="{
                                title: 'Delete product',
                                message: 'The product and its related assets will be permanently deleted.',
                                confirmLabel: 'Delete',
                                cancelLabel: 'Keep product',
                            }"
                            preset="danger"
                        >
                            Custom confirm
                        </AppButton>
                    </div>
                </div>

                <div class="home-button-example">
                    <span class="home-button-example-label">Icon buttons</span>

                    <div class="home-actions">
                        <AppButton
                            icon-only
                            label="Add product"
                            preset="primary"
                            @click="showButtonFeedback('Product added')"
                        >
                            <Plus :size="15" />
                        </AppButton>

                        <AppButton
                            :action="runDeleteAction"
                            :confirm="{
                                title: 'Delete product',
                                message: 'This action cannot be undone.',
                                confirmLabel: 'Delete',
                            }"
                            icon-only
                            label="Delete product"
                            preset="danger"
                        >
                            <Trash2 :size="15" />
                        </AppButton>

                        <AppButton
                            icon-only
                            label="More options"
                            preset="ghost"
                            @click="showButtonFeedback('Options clicked')"
                        >
                            <Ellipsis :size="16" />
                        </AppButton>
                    </div>
                </div>
            </div>
        </div>

        <div class="home-section">
            <h2 class="home-section-title">Temporary notifications</h2>

            <div class="home-actions">
                <AppButton v-log="'Test'" preset="success" @click="showSuccess">Success</AppButton>

                <AppButton preset="info" @click="showInfo">Info</AppButton>

                <AppButton preset="warning" @click="showWarning">Warning</AppButton>

                <AppButton preset="danger" @click="showError">Error</AppButton>

                <AppButton preset="danger" @click="showLongError">Long error</AppButton>
            </div>
        </div>

        <div class="home-section">
            <h2 class="home-section-title">Saved notifications</h2>

            <div class="home-actions">
                <AppButton preset="success" @click="showSavedSuccess">Saved success</AppButton>

                <AppButton preset="info" @click="showSavedInfo">Saved info</AppButton>

                <AppButton preset="warning" @click="showSavedWarning">Saved warning</AppButton>

                <AppButton preset="danger" @click="showSavedError">Saved error</AppButton>

                <AppButton preset="danger" @click="showSavedLongError">Saved long error</AppButton>
            </div>
        </div>

        <div class="home-section">
            <h2 class="home-section-title">Dialogs</h2>

            <div class="home-actions">
                <AppButton preset="primary" @click="dialogOpened = true">Dialog</AppButton>

                <AppButton preset="primary" @click="modalOpened = true">Modal</AppButton>

                <AppButton preset="primary" @click="blockingDialogOpened = true">Blocking</AppButton>

                <AppButton preset="primary" @click="sizedDialogOpened = true">Custom size</AppButton>

                <AppButton preset="primary" @click="positionedDialogOpened = true">Top position</AppButton>

                <AppButton preset="primary" @click="openAlertsDialog">Dialog alerts</AppButton>
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
                <AppButton preset="primary" @click="dialogOpened = false">Close</AppButton>
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
                <AppButton preset="secondary" @click="modalOpened = false">Cancel</AppButton>

                <AppButton preset="primary" @click="modalOpened = false">Save</AppButton>
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
                <AppButton preset="secondary" @click="blockingDialogOpened = false">Continue editing</AppButton>

                <AppButton preset="danger" @click="blockingDialogOpened = false">Leave without saving</AppButton>
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
                <AppButton preset="primary" @click="sizedDialogOpened = false">Close</AppButton>
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

                <AppButton preset="secondary">Focusable action</AppButton>
            </div>

            <template #footer>
                <AppButton preset="primary" @click="positionedDialogOpened = false">Done</AppButton>
            </template>
        </AppDialog>

        <AppDialog v-model:opened="alertsDialogOpened" type="modal" title="Application alerts" width="680px">
            <div v-if="alerts.length" class="popup-alerts">
                <AppAlert
                    v-for="alert in alerts"
                    :key="alert.id"
                    :type="alert.type"
                    :title="alert.title"
                    :message="alert.message"
                    :details="alert.details"
                    dismissible
                    @close="removeAlert(alert.id)"
                />
            </div>

            <div v-else class="popup-alerts-empty">All alerts have been dismissed.</div>

            <template #footer>
                <AppButton preset="secondary" @click="resetAlerts">Reset alerts</AppButton>

                <AppButton preset="primary" @click="alertsDialogOpened = false">Close</AppButton>
            </template>
        </AppDialog>
    </section>
</template>

<script setup lang="ts">
import { Ellipsis, Plus, Trash2 } from '@lucide/vue'
import { ref } from 'vue'

import AppAlert from '@/components/AppAlert.vue'
import AppButton from '@/components/AppButton.vue'
import AppDialog from '@/components/AppDialog.vue'
import { useFeedbackStore } from '@/stores/feedback'
import { useNotificationsStore, type NotificationType } from '@/stores/notifications'

interface AlertItem {
    id: number
    type: NotificationType
    title: string
    message?: string
    details?: string
}

const notifications = useNotificationsStore()
const feedback = useFeedbackStore()

const dialogOpened = ref(false)
const modalOpened = ref(false)
const blockingDialogOpened = ref(false)
const sizedDialogOpened = ref(false)
const positionedDialogOpened = ref(false)
const alertsDialogOpened = ref(false)
const manualLoading = ref(false)
const alerts = ref<AlertItem[]>([])

const defaultAlerts: AlertItem[] = [
    {
        id: 1,
        type: 'success',
        title: 'Product saved',
        message: 'All product changes were saved successfully.',
    },
    {
        id: 2,
        type: 'info',
        title: 'Import in progress',
        message: 'Assets are being imported in the background. You can continue working.',
        details: 'Import ID: IMP-2026-00428',
    },
    {
        id: 3,
        type: 'warning',
        title: 'Missing information',
        message: 'Some optional product fields have not been completed.',
    },
    {
        id: 4,
        type: 'error',
        title: 'The product could not be saved',
        message: 'The selected supplier is inactive and two required asset fields are missing.',
        details:
            'POST /api/products returned HTTP 422. Validation failed for supplierId, primaryAssetId and previewAssetId.',
    },
]

function openAlertsDialog(): void {
    resetAlerts()
    alertsDialogOpened.value = true
}

function removeAlert(id: number): void {
    alerts.value = alerts.value.filter((alert) => alert.id !== id)
}

function resetAlerts(): void {
    alerts.value = defaultAlerts.map((alert) => ({
        ...alert,
    }))
}

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
        details: 'POST /api/products returned HTTP 422.\nValidation failed for supplierId and primaryAssetId.',
    })
}

function showLongError(): void {
    notifications.error('The order synchronization request could not be completed successfully', {
        message:
            'The external system returned an unexpected response while synchronizing the order. Some related assets, reservation dates, assigned users and pricing information may not have been updated. Review the synchronization logs and try again after verifying the external service connection.',
        details:
            'POST /api/orders/428/synchronize returned HTTP 503.\nUpstream service: asset-registry\nRequest ID: req_01JZ3AG17K3J4P7X4H9M6R2WQE',
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
        details:
            'POST /api/orders/428/synchronize returned HTTP 422.\nValidation failed for warehouseId and assignedUserId.',
        save: true,
        route: '/orders',
    })
}

function showSavedLongError(): void {
    notifications.error('Order synchronization failed because several related records could not be processed', {
        message:
            'The external system rejected the synchronization request because some assets referenced by the order no longer exist, several reservation dates overlap with existing reservations and one assigned user does not have permission to access the selected warehouse. Open the order to review all validation errors before attempting synchronization again.',
        details:
            'POST /api/orders/428/synchronize returned HTTP 422.\n\nMissing assets: AST-1042, AST-1048\nOverlapping reservations: RES-302, RES-309\nUnauthorized user: USR-91\nRequest ID: req_01JZ3AG17K3J4P7X4H9M6R2WQE',
        duration: 12_000,
        save: true,
        route: '/orders',
    })
}

function showButtonFeedback(message: string): void {
    feedback.show(message)
}

function startManualLoading(): void {
    manualLoading.value = true

    window.setTimeout(() => {
        manualLoading.value = false
        feedback.show('Controlled action completed')
    }, 2_000)
}

async function runAsyncAction(): Promise<void> {
    await wait(2_000)

    feedback.show('Async action completed')
}

async function runConfirmedAction(): Promise<void> {
    await wait(1_000)

    feedback.show('Confirmed action completed')
}

async function runDeleteAction(): Promise<void> {
    await wait(1_500)

    feedback.show('Product deleted')
}

function wait(duration: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration)
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

.home-button-examples {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.home-button-example {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.home-button-example-label {
    color: var(--color-text-muted);
    font-size: 11px;
    font-weight: 650;
}

.home-actions-aligned {
    align-items: center;
}

.home-spinner-examples {
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--color-primary);
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

.popup-alerts {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.popup-alerts-empty {
    color: var(--color-text-muted);
    font-size: 12px;
}
</style>
