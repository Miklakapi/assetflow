<template>
    <nav class="application-menu">
        <div v-if="menu.isLoading" class="application-menu-message">Loading...</div>

        <div v-else-if="menu.error" class="application-menu-message application-menu-error">
            {{ menu.error.message }}
        </div>

        <div v-else class="application-menu-sections">
            <section v-for="item in menu.items" :key="item.id" class="application-menu-section">
                <RouterLink
                    v-if="item.route"
                    :to="item.route"
                    :title="expanded ? undefined : item.label"
                    class="application-menu-link application-menu-section-link"
                >
                    <span class="application-menu-icon">
                        <component :is="getMenuIcon(item.icon)" :size="19" :stroke-width="1.8" />
                    </span>

                    <span v-if="expanded" class="application-menu-label">
                        {{ item.label }}
                    </span>
                </RouterLink>

                <AppButton
                    v-else
                    :class="{ 'application-menu-section-opened': openedSectionId === item.id }"
                    :label="item.label"
                    :title="expanded ? undefined : item.label"
                    class="application-menu-section-button"
                    preset="ghost"
                    @click.stop="openSection(item.id)"
                >
                    <span class="application-menu-icon">
                        <component :is="getMenuIcon(item.icon)" :size="19" :stroke-width="1.8" />
                    </span>

                    <span v-if="expanded" class="application-menu-label">
                        {{ item.label }}
                    </span>
                </AppButton>

                <div
                    v-if="expanded && openedSectionId === item.id && item.children.length"
                    class="application-menu-children"
                >
                    <RouterLink
                        v-for="child in item.children"
                        :key="child.id"
                        :to="child.route ?? '/'"
                        class="application-menu-link application-menu-child-link"
                    >
                        {{ child.label }}
                    </RouterLink>
                </div>
            </section>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { BookOpen, Box, CalendarDays, Circle, Package, ShoppingCart, type LucideIcon } from '@lucide/vue'
import { onMounted } from 'vue'

import AppButton from '@/components/AppButton.vue'
import { useMenuStore } from '@/stores/menu'

const menu = useMenuStore()

defineProps<{
    expanded: boolean
    openedSectionId: string | null
}>()

const emit = defineEmits<{
    openSection: [sectionId: string]
}>()

const menuIcons: Record<string, LucideIcon> = {
    catalog: Package,
    orders: ShoppingCart,
    reservations: CalendarDays,
    dictionaries: BookOpen,
    assets: Box,
}

function openSection(sectionId: string): void {
    emit('openSection', sectionId)
}

function getMenuIcon(icon: string | null): LucideIcon {
    if (!icon) {
        return Circle
    }

    return menuIcons[icon] ?? Circle
}

onMounted(menu.loadMenu)
</script>

<style scoped>
.application-menu {
    flex: 1;
    padding: 8px;
    overflow-x: hidden;
    overflow-y: auto;
}

.application-menu-message {
    padding: 12px 8px;
    color: var(--color-text-muted);
    font-size: 13px;
    white-space: nowrap;
}

.application-menu-error {
    color: var(--color-error);
}

.application-menu-sections {
    display: flex;
    width: 194px;
    flex-direction: column;
    gap: 8px;
}

.application-menu-section {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.application-menu-section-button,
.application-menu-link {
    display: flex;
    width: 194px;
    align-items: center;
    padding: 0;
    border-radius: 7px;
    color: var(--color-text);
    font: inherit;
    text-align: left;
    text-decoration: none;
}

.application-menu-section-button,
.application-menu-section-link {
    min-height: 40px;
    justify-content: flex-start;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.application-menu-section-button :deep(.app-button-content) {
    width: 100%;
    justify-content: flex-start;
    gap: 0;
}

.application-menu-icon {
    display: flex;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
}

.application-menu-label {
    padding-right: 10px;
}

.application-menu-section-button:hover:not(:disabled),
.application-menu-link:hover,
.application-menu-section-opened {
    background: var(--color-surface-hover);
    color: var(--color-text-strong);
    filter: none;
}

.application-menu-children {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-left: 40px;
}

.application-menu-child-link {
    width: 154px;
    min-height: 30px;
    padding: 0 10px;
    color: var(--color-text-muted);
    font-size: 13px;
    white-space: nowrap;
}

.application-menu-link.router-link-active {
    background: var(--color-surface-active);
    color: var(--color-primary);
}
</style>
