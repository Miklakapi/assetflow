<template>
    <Teleport to="body">
        <dialog
            ref="dialogRef"
            :class="[
                `application-dialog-position-${props.position}`,
                {
                    'application-dialog-header-mac': closeButtonOnLeft,
                    'application-dialog-dragging': draggable.dragging.value,
                },
            ]"
            :style="[
                {
                    width: props.width,
                    height: props.height,
                },
                draggable.style.value,
            ]"
            class="application-dialog"
            @keydown.esc.capture="handleEscapeKeydown"
            @cancel="handleCancel"
            @click="handleBackdropClick"
            @close="handleNativeClose"
        >
            <header ref="headerRef" class="application-dialog-header" @pointerdown="draggable.start">
                <button
                    v-if="closable && closeButtonOnLeft"
                    class="application-dialog-close"
                    type="button"
                    @click="close"
                >
                    <X :size="17" />
                </button>

                <span v-else class="application-dialog-header-spacer"></span>

                <div class="application-dialog-header-content">
                    <slot name="header">
                        <div class="application-dialog-title">
                            {{ props.title }}
                        </div>
                    </slot>
                </div>

                <button
                    v-if="closable && !closeButtonOnLeft"
                    class="application-dialog-close"
                    type="button"
                    @click="close"
                >
                    <X :size="17" />
                </button>

                <span v-else class="application-dialog-header-spacer"></span>
            </header>

            <div class="application-dialog-content">
                <div v-if="$slots.error" class="application-dialog-error">
                    <slot name="error" />
                </div>

                <slot />
            </div>

            <footer v-if="$slots.footer" class="application-dialog-footer">
                <slot name="footer" />
            </footer>
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useDraggable } from '@/composables/useDraggable'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useModalLayer } from '@/composables/useModalLayer'

const props = withDefaults(
    defineProps<{
        type?: 'dialog' | 'modal' | 'blocking'
        title?: string
        width?: string
        height?: string
        position?: 'center' | 'top' | 'bottom'
    }>(),
    {
        type: 'dialog',
        title: '',
        width: '640px',
        height: undefined,
        position: 'center',
    },
)

const opened = defineModel<boolean>('opened', {
    required: true,
})

const dialogRef = ref<HTMLDialogElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)

const focusTrap = useFocusTrap(dialogRef)
const modalLayer = useModalLayer()
const draggable = useDraggable(dialogRef, {
    handleRef: headerRef,
    boundary: 'viewport',
})

const closable = computed(() => {
    return props.type !== 'blocking'
})

const closeOnEscape = computed(() => {
    return props.type !== 'blocking'
})

const closeOnBackdrop = computed(() => {
    return props.type === 'dialog'
})

const closeButtonOnLeft = computed(() => {
    return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
})

function close(): void {
    opened.value = false
}

function handleCancel(event: Event): void {
    event.preventDefault()

    if (!closeOnEscape.value || !modalLayer.isTopLayer.value) {
        return
    }

    close()
}

function handleBackdropClick(event: MouseEvent): void {
    if (!closeOnBackdrop.value || event.target !== dialogRef.value) {
        return
    }

    const dialog = dialogRef.value

    if (!dialog) {
        return
    }

    const rect = dialog.getBoundingClientRect()
    const clickedInsideDialog =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

    if (!clickedInsideDialog) {
        close()
    }
}

function handleNativeClose(): void {
    if (opened.value) {
        opened.value = false
    }
}

function handleKeyboard(event: KeyboardEvent): void {
    if (!opened.value || !modalLayer.isTopLayer.value) {
        return
    }

    focusTrap.handleKeydown(event)
}

function handleEscapeKeydown(event: KeyboardEvent): void {
    if (closeOnEscape.value) {
        return
    }

    event.preventDefault()
    event.stopPropagation()
}

async function openDialog(): Promise<void> {
    await nextTick()

    const dialog = dialogRef.value

    if (!dialog || dialog.open) {
        return
    }

    modalLayer.activate()
    dialog.showModal()

    await nextTick()

    draggable.reset()
    await focusTrap.activate()
}

function closeDialog(): void {
    draggable.stop()
    focusTrap.deactivate()

    if (dialogRef.value?.open) {
        dialogRef.value.close()
    }

    modalLayer.deactivate()
}

watch(
    opened,
    (isOpened) => {
        if (isOpened) {
            openDialog()

            return
        }

        closeDialog()
    },
    {
        immediate: true,
    },
)

onMounted(() => {
    document.addEventListener('keydown', handleKeyboard)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyboard)
    closeDialog()
})
</script>

<style scoped>
.application-dialog {
    display: grid;
    max-width: calc(100vw - 32px);
    max-height: calc(100dvh - 32px);
    grid-template-rows: auto minmax(0, 1fr) auto;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    outline: none;
    background: var(--color-surface);
    box-shadow: 0 24px 70px rgb(var(--color-shadow) / 24%);
    color: var(--color-text);
    transition:
        opacity 180ms ease,
        scale 180ms ease,
        display 180ms allow-discrete,
        overlay 180ms allow-discrete;
}

.application-dialog::backdrop {
    background: color-mix(in srgb, var(--color-black) 32%, transparent);
    transition:
        background 180ms ease,
        display 180ms allow-discrete,
        overlay 180ms allow-discrete;
}

.application-dialog:not([open]) {
    opacity: 0;
    scale: 0.97;
}

.application-dialog:not([open])::backdrop {
    background: transparent;
}

@starting-style {
    .application-dialog[open] {
        opacity: 0;
        scale: 0.97;
    }

    .application-dialog[open]::backdrop {
        background: transparent;
    }
}

.application-dialog-position-center {
    margin: auto;
}

.application-dialog-position-top {
    margin: 16px auto auto;
}

.application-dialog-position-bottom {
    margin: auto auto 16px;
}

.application-dialog-header {
    display: grid;
    min-height: 44px;
    grid-template-columns: 28px minmax(0, 1fr) 28px;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-bottom: 1px solid var(--color-border);
    cursor: grab;
    touch-action: none;
    user-select: none;
}

.application-dialog-dragging .application-dialog-header {
    cursor: grabbing;
}

.application-dialog-header-content {
    min-width: 0;
}

.application-dialog-title {
    overflow: hidden;
    color: var(--color-text-strong);
    font-size: 14px;
    font-weight: 700;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.application-dialog-header-mac .application-dialog-title {
    text-align: center;
}

.application-dialog-header-spacer {
    width: 28px;
    height: 28px;
}

.application-dialog-close {
    display: flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
}

.application-dialog-close:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-strong);
}

.application-dialog-content {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    padding: 12px;
}

.application-dialog-error {
    padding-bottom: 10px;
}

.application-dialog-footer {
    display: flex;
    min-height: 48px;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    padding: 8px 12px;
    border-top: 1px solid var(--color-border);
    background: var(--color-surface);
}

@media (max-width: 680px) {
    .application-dialog {
        width: calc(100vw - 24px) !important;
        max-width: calc(100vw - 24px);
        max-height: calc(100dvh - 24px);
    }

    .application-dialog-position-top {
        margin-top: 12px;
    }

    .application-dialog-position-bottom {
        margin-bottom: 12px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .application-dialog,
    .application-dialog::backdrop {
        transition: none;
    }
}
</style>
