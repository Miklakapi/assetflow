import { computed, onBeforeUnmount, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

export type DraggableAxis = 'x' | 'y' | 'both'
export type DraggableBoundary = 'viewport' | Ref<HTMLElement | null> | null

export interface DraggablePosition {
    x: number
    y: number
}

export interface UseDraggableOptions {
    handleRef?: Ref<HTMLElement | null>
    axis?: DraggableAxis
    boundary?: DraggableBoundary
    enabled?: MaybeRefOrGetter<boolean>
    ignoredElements?: string
    onStart?: (position: DraggablePosition) => void
    onMove?: (position: DraggablePosition) => void
    onEnd?: (position: DraggablePosition) => void
}

const defaultIgnoredElements = 'button, a, input, select, textarea, [data-drag-ignore]'

export function useDraggable(elementRef: Ref<HTMLElement | null>, options: UseDraggableOptions = {}) {
    const positionX = ref(0)
    const positionY = ref(0)
    const dragging = ref(false)

    const position = computed<DraggablePosition>(() => {
        return {
            x: positionX.value,
            y: positionY.value,
        }
    })

    const style = computed(() => {
        return {
            translate: `${positionX.value}px ${positionY.value}px`,
        }
    })

    let pointerId: number | null = null
    let dragStartPointerX = 0
    let dragStartPointerY = 0
    let dragStartPositionX = 0
    let dragStartPositionY = 0
    let dragStartElementRect: DOMRect | null = null
    let previousBodyUserSelect = ''

    function start(event: PointerEvent): void {
        if (!isEnabled() || event.button !== 0 || dragging.value) {
            return
        }

        const element = elementRef.value

        if (!element || shouldIgnoreTarget(event.target)) {
            return
        }

        pointerId = event.pointerId
        dragging.value = true

        dragStartPointerX = event.clientX
        dragStartPointerY = event.clientY
        dragStartPositionX = positionX.value
        dragStartPositionY = positionY.value
        dragStartElementRect = element.getBoundingClientRect()

        previousBodyUserSelect = document.body.style.userSelect
        document.body.style.userSelect = 'none'

        options.handleRef?.value?.setPointerCapture(event.pointerId)

        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', stop)
        document.addEventListener('pointercancel', stop)

        options.onStart?.(position.value)
    }

    function move(event: PointerEvent): void {
        if (!dragging.value || event.pointerId !== pointerId || !dragStartElementRect) {
            return
        }

        const deltaX = event.clientX - dragStartPointerX
        const deltaY = event.clientY - dragStartPointerY
        const axis = options.axis ?? 'both'

        const nextPositionX = axis === 'y' ? dragStartPositionX : dragStartPositionX + deltaX
        const nextPositionY = axis === 'x' ? dragStartPositionY : dragStartPositionY + deltaY
        const constrainedPosition = constrainPosition(nextPositionX, nextPositionY)

        positionX.value = constrainedPosition.x
        positionY.value = constrainedPosition.y

        options.onMove?.(constrainedPosition)
    }

    function stop(event?: PointerEvent): void {
        if (!dragging.value) {
            return
        }

        if (event && pointerId !== null && event.pointerId !== pointerId) {
            return
        }

        if (pointerId !== null && options.handleRef?.value?.hasPointerCapture(pointerId)) {
            options.handleRef.value.releasePointerCapture(pointerId)
        }

        dragging.value = false
        pointerId = null
        dragStartElementRect = null

        document.body.style.userSelect = previousBodyUserSelect

        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerup', stop)
        document.removeEventListener('pointercancel', stop)

        options.onEnd?.(position.value)
    }

    function reset(): void {
        setPosition(0, 0)
    }

    function setPosition(x: number, y: number): void {
        const constrainedPosition = constrainCurrentPosition(x, y)

        positionX.value = constrainedPosition.x
        positionY.value = constrainedPosition.y
    }

    function isEnabled(): boolean {
        return options.enabled === undefined || toValue(options.enabled)
    }

    function shouldIgnoreTarget(target: EventTarget | null): boolean {
        if (!(target instanceof Element)) {
            return false
        }

        const handle = options.handleRef?.value

        if (handle && !handle.contains(target)) {
            return true
        }

        return Boolean(target.closest(options.ignoredElements ?? defaultIgnoredElements))
    }

    function constrainPosition(x: number, y: number): DraggablePosition {
        const boundaryRect = getBoundaryRect()

        if (!boundaryRect || !dragStartElementRect) {
            return { x, y }
        }

        const minimumX = dragStartPositionX + boundaryRect.left - dragStartElementRect.left
        const maximumX = dragStartPositionX + boundaryRect.right - dragStartElementRect.right
        const minimumY = dragStartPositionY + boundaryRect.top - dragStartElementRect.top
        const maximumY = dragStartPositionY + boundaryRect.bottom - dragStartElementRect.bottom

        return {
            x: clamp(x, minimumX, maximumX),
            y: clamp(y, minimumY, maximumY),
        }
    }

    function constrainCurrentPosition(x: number, y: number): DraggablePosition {
        const element = elementRef.value
        const boundaryRect = getBoundaryRect()

        if (!element || !boundaryRect) {
            return { x, y }
        }

        const elementRect = element.getBoundingClientRect()
        const deltaX = x - positionX.value
        const deltaY = y - positionY.value

        const minimumDeltaX = boundaryRect.left - elementRect.left
        const maximumDeltaX = boundaryRect.right - elementRect.right
        const minimumDeltaY = boundaryRect.top - elementRect.top
        const maximumDeltaY = boundaryRect.bottom - elementRect.bottom

        return {
            x: positionX.value + clamp(deltaX, minimumDeltaX, maximumDeltaX),
            y: positionY.value + clamp(deltaY, minimumDeltaY, maximumDeltaY),
        }
    }

    function getBoundaryRect(): DOMRect | null {
        const boundary = options.boundary ?? 'viewport'

        if (boundary === null) {
            return null
        }

        if (boundary === 'viewport') {
            return new DOMRect(0, 0, window.innerWidth, window.innerHeight)
        }

        return boundary.value?.getBoundingClientRect() ?? null
    }

    function clamp(value: number, minimum: number, maximum: number): number {
        if (minimum > maximum) {
            return minimum
        }

        return Math.min(Math.max(value, minimum), maximum)
    }

    onBeforeUnmount(stop)

    return {
        position,
        positionX,
        positionY,
        dragging,
        style,
        start,
        stop,
        reset,
        setPosition,
    }
}
