<template>
    <div class="application">
        <aside
            ref="sidebarRef"
            :class="{ 'application-sidebar-expanded': sidebarExpanded }"
            class="application-sidebar"
            @click="expandSidebar"
        >
            <div class="application-logo">
                <span v-if="sidebarExpanded" class="application-logo-label">Assetflow</span>

                <span v-else class="application-logo-mark">A</span>
            </div>

            <ApplicationMenu
                :expanded="sidebarExpanded"
                :opened-section-id="openedSectionId"
                @open-section="openSidebarSection"
            />
        </aside>

        <div class="application-main">
            <header class="application-header">
                <div class="application-header-title">Asset management</div>

                <div class="application-header-actions">
                    <button class="application-header-button" type="button">
                        <Bell :size="17" />
                    </button>

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
import { Bell, Settings, User } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import ApplicationMenu from '../components/ApplicationMenu.vue'

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
    background: #ffffff;
    color: #1f2937;
}

.application-sidebar {
    display: flex;
    width: 56px;
    flex-shrink: 0;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
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
    background: #ffffff;
}

.application-header {
    display: flex;
    height: 52px;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    background: #ffffff;
}

.application-header-title {
    color: #6b7280;
    font-size: 13px;
}

.application-header-actions {
    display: flex;
    align-items: center;
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
    color: #4b5563;
    cursor: pointer;
}

.application-header-button:hover,
.application-user-button:hover {
    background: #f3f4f6;
    color: #111827;
}

.application-user-button {
    background: #f3f4f6;
}

.application-content {
    min-width: 0;
    flex: 1;
    padding: 16px 18px;
    border-top-left-radius: 16px;
    background: #f5f6f8;
}
</style>
