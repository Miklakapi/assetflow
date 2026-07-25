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
    </section>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'

const notifications = useNotificationsStore()

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
</style>
