<template>
    <div class="application">
        <aside
            ref="sidebarRef"
            class="application-sidebar"
            :class="{ 'application-sidebar-expanded': sidebarExpanded }"
            @click="expandSidebar"
        >
            <div class="application-logo">
                <span v-if="sidebarExpanded" class="application-logo-label">Assetflow</span>

                <span v-else class="application-logo-mark">A</span>
            </div>

            <AppMenu
                :expanded="sidebarExpanded"
                :opened-section-id="openedSectionId"
                @open-section="openSidebarSection"
            />
        </aside>

        <div class="application-main">
            <header class="application-header">
                <div class="application-header-title">Asset management</div>

                <AppSearch />

                <div class="application-header-actions">
                    <AppNotifications />

                    <button class="application-header-button" type="button">
                        <Settings :size="17" />
                    </button>

                    <button class="application-user-button" type="button">
                        <User :size="17" />
                    </button>
                </div>
            </header>

            <main class="application-content">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Settings, User } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import AppMenu from '../components/AppMenu.vue'
import AppNotifications from '../components/AppNotifications.vue'
import AppSearch from '../components/AppSearch.vue'

const sidebarRef = ref<HTMLElement | null>(null)
const sidebarExpanded = ref(false)
const openedSectionId = ref<string | null>(null)

function expandSidebar(): void {
    sidebarExpanded.value = true
}

function openSidebarSection(sectionId: string): void {
    const sectionAlreadyOpened = sidebarExpanded.value && openedSectionId.value === sectionId

    sidebarExpanded.value = true
    openedSectionId.value = sectionAlreadyOpened ? null : sectionId
}

function closeSidebar(): void {
    sidebarExpanded.value = false
    openedSectionId.value = null
}

function closeSidebarOnOutsideClick(event: PointerEvent): void {
    const target = event.target

    if (!(target instanceof Node)) {
        return
    }

    if (sidebarRef.value?.contains(target)) {
        return
    }

    closeSidebar()
}

onMounted(() => {
    document.addEventListener('pointerdown', closeSidebarOnOutsideClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', closeSidebarOnOutsideClick)
})
</script>

<style scoped>
.application {
    display: flex;
    min-height: 100vh;
    background: var(--color-surface);
    color: var(--color-text);
}

.application-sidebar {
    display: flex;
    width: 56px;
    flex-shrink: 0;
    flex-direction: column;
    overflow: hidden;
    background: var(--color-surface);
    transition: width 160ms ease;
}

.application-sidebar-expanded {
    width: 210px;
}

.application-logo {
    display: flex;
    width: 100%;
    height: 52px;
    flex-shrink: 0;
    align-items: center;
    white-space: nowrap;
}

.application-logo-mark {
    display: flex;
    width: 56px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
}

.application-logo-label {
    padding: 0 18px;
    font-size: 18px;
    font-weight: 700;
}

.application-main {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    background: var(--color-surface);
}

.application-header {
    display: grid;
    height: 52px;
    flex-shrink: 0;
    grid-template-columns: minmax(140px, 1fr) auto minmax(140px, 1fr);
    align-items: center;
    gap: 16px;
    padding: 0 18px;
    background: var(--color-surface);
}

.application-header-title {
    color: var(--color-text-muted);
    font-size: 13px;
}

.application-header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
}

.application-header-button,
.application-user-button {
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
}

.application-header-button:hover,
.application-user-button:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-strong);
}

.application-user-button {
    background: var(--color-surface-hover);
}

.application-content {
    min-width: 0;
    flex: 1;
    padding: 16px 18px;
    border-top-left-radius: 16px;
    background: var(--color-background);
}

@media (max-width: 760px) {
    .application-header {
        grid-template-columns: auto 1fr auto;
        gap: 8px;
        padding: 0 10px;
    }

    .application-header-title {
        display: none;
    }
}
</style>
