<template>
    <span
        :style="spinnerStyle"
        :aria-hidden="props.label ? undefined : true"
        :role="props.label ? 'status' : undefined"
        class="app-spinner"
    >
        <svg class="app-spinner-icon" viewBox="0 0 24 24">
            <circle :stroke-width="props.thickness" class="app-spinner-track" cx="12" cy="12" r="9" />

            <circle :stroke-width="props.thickness" class="app-spinner-progress" cx="12" cy="12" r="9" />
        </svg>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        size?: number | string
        thickness?: number
        label?: string
    }>(),
    {
        size: 16,
        thickness: 2,
        label: '',
    },
)

const spinnerStyle = computed(() => {
    const size = typeof props.size === 'number' ? `${props.size}px` : props.size

    return {
        '--app-spinner-size': size,
    }
})
</script>

<style scoped>
.app-spinner {
    display: inline-block;
    width: var(--app-spinner-size);
    height: var(--app-spinner-size);
    flex: 0 0 var(--app-spinner-size);
    color: currentColor;
    line-height: 0;
    contain: layout paint;
}

.app-spinner-icon {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    animation: app-spinner-rotate 950ms linear infinite;
    transform-origin: center;
}

.app-spinner-track,
.app-spinner-progress {
    fill: none;
    vector-effect: non-scaling-stroke;
}

.app-spinner-track {
    stroke: currentColor;
    opacity: 0.16;
}

.app-spinner-progress {
    stroke: currentColor;
    stroke-linecap: round;
    stroke-dasharray: 17 57;
}

@keyframes app-spinner-rotate {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .app-spinner-icon {
        animation-duration: 1800ms;
    }
}
</style>
