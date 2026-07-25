import { nextTick, onBeforeUnmount, ref, type Ref } from 'vue'

const focusableElementSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useFocusTrap(containerRef: Ref<HTMLElement | null>) {
    const active = ref(false)

    let previouslyFocusedElement: HTMLElement | null = null

    function getFocusableElements(): HTMLElement[] {
        if (!containerRef.value) {
            return []
        }

        return Array.from(containerRef.value.querySelectorAll<HTMLElement>(focusableElementSelector)).filter(
            isFocusableElement,
        )
    }

    function isFocusableElement(element: HTMLElement): boolean {
        if (element.closest('[inert]')) {
            return false
        }

        if (element.getAttribute('aria-hidden') === 'true') {
            return false
        }

        return element.getClientRects().length > 0
    }

    function focusFirstElement(): void {
        const firstFocusableElement = getFocusableElements()[0]

        if (firstFocusableElement) {
            firstFocusableElement.focus()

            return
        }

        containerRef.value?.focus()
    }

    async function activate(): Promise<void> {
        if (active.value) {
            return
        }

        previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null

        active.value = true

        await nextTick()

        focusFirstElement()
    }

    function deactivate(options: { restoreFocus?: boolean } = {}): void {
        if (!active.value) {
            return
        }

        const restoreFocus = options.restoreFocus ?? true
        const elementToFocus = previouslyFocusedElement

        active.value = false
        previouslyFocusedElement = null

        if (!restoreFocus || !elementToFocus?.isConnected) {
            return
        }

        nextTick(() => {
            elementToFocus.focus()
        })
    }

    function handleKeydown(event: KeyboardEvent): void {
        if (!active.value || event.key !== 'Tab') {
            return
        }

        const focusableElements = getFocusableElements()
        const firstFocusableElement = focusableElements[0]
        const lastFocusableElement = focusableElements.at(-1)
        const focusedElement = document.activeElement

        if (!firstFocusableElement || !lastFocusableElement) {
            event.preventDefault()
            containerRef.value?.focus()

            return
        }

        if (event.shiftKey) {
            if (focusedElement === firstFocusableElement || !containerRef.value?.contains(focusedElement)) {
                event.preventDefault()
                lastFocusableElement.focus()
            }

            return
        }

        if (focusedElement === lastFocusableElement || !containerRef.value?.contains(focusedElement)) {
            event.preventDefault()
            firstFocusableElement.focus()
        }
    }

    onBeforeUnmount(() => {
        deactivate()
    })

    return {
        active,
        activate,
        deactivate,
        focusFirstElement,
        handleKeydown,
    }
}
