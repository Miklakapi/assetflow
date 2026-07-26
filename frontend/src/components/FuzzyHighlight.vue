<template>
    <span>
        <template v-for="(character, index) in value" :key="index">
            <strong v-if="matchedIndexesSet.has(index)">
                {{ character }}
            </strong>

            <template v-else>
                {{ character }}
            </template>
        </template>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    value: string
    matchedIndexes: number[]
}>()

const matchedIndexesSet = computed(() => {
    return new Set(props.matchedIndexes)
})
</script>

<style scoped>
strong {
    color: var(--color-text-strong);
    font-weight: 700;
}
</style>
