<template>
    <AppConfirmDialog />
    <AppFeedback />
    <AppNotifications />

    <RouterView />
</template>

<script setup lang="ts">
import AppConfirmDialog from '@/components/AppConfirmDialog.vue'
import AppFeedback from '@/components/AppFeedback.vue'
import AppNotifications from '@/components/AppNotifications.vue'
</script>
