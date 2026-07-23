<template>
    <nav class="application-menu">
        <div v-if="loading" class="application-menu-message">Loading...</div>

        <div v-else-if="errorMessage" class="application-menu-message application-menu-error">
            {{ errorMessage }}
        </div>

        <div v-else class="application-menu-sections">
            <section v-for="item in menuItems" :key="item.id" class="application-menu-section">
                <RouterLink
                    v-if="item.route"
                    :to="item.route"
                    :title="props.expanded ? undefined : item.label"
                    class="application-menu-link application-menu-section-link"
                >
                    <span class="application-menu-icon">
                        <component :is="getMenuIcon(item.icon)" :size="19" :stroke-width="1.8" />
                    </span>

                    <span v-if="props.expanded" class="application-menu-label">
                        {{ item.label }}
                    </span>
                </RouterLink>

                <button
                    v-else
                    :class="{ 'application-menu-section-opened': props.openedSectionId === item.id }"
                    :title="props.expanded ? undefined : item.label"
                    class="application-menu-section-button"
                    type="button"
                    @click.stop="openSection(item.id)"
                >
                    <span class="application-menu-icon">
                        <component :is="getMenuIcon(item.icon)" :size="19" :stroke-width="1.8" />
                    </span>

                    <span v-if="props.expanded" class="application-menu-label">
                        {{ item.label }}
                    </span>
                </button>

                <div
                    v-if="props.expanded && props.openedSectionId === item.id && item.children.length"
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
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { getMenu } from '@/domain/menu/api'
import type { MenuItem } from '@/domain/menu/schema'

const props = defineProps<{
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

const menuItems = ref<MenuItem[]>([])
const loading = ref(true)
const errorMessage = ref<string | null>(null)

async function loadMenu(): Promise<void> {
    try {
        const response = await getMenu()

        menuItems.value = response.items
    } catch (error) {
        console.error(error)

        errorMessage.value = 'The menu could not be loaded.'
    } finally {
        loading.value = false
    }
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

onMounted(loadMenu)
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
    color: #6b7280;
    font-size: 13px;
    white-space: nowrap;
}

.application-menu-error {
    color: #b91c1c;
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
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: #374151;
    font: inherit;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
}

.application-menu-section-button,
.application-menu-section-link {
    min-height: 40px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
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

.application-menu-section-button:hover,
.application-menu-link:hover,
.application-menu-section-opened {
    background: #f3f4f6;
    color: #111827;
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
    color: #6b7280;
    font-size: 13px;
    white-space: nowrap;
}

.application-menu-link.router-link-active {
    background: #eef2ff;
    color: #4f46e5;
}
</style>
