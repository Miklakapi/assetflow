<template>
    <AppFeedback />
    <AppNotifications />

    <RouterView />
</template>

<script setup lang="ts">
import AppFeedback from '@/components/AppFeedback.vue'
import AppNotifications from '@/components/AppNotifications.vue'
</script>
