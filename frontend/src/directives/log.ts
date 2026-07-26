import type { ObjectDirective } from 'vue'

const values = new WeakMap<HTMLElement, unknown>()
const listeners = new WeakMap<HTMLElement, EventListener>()

const logDirective: ObjectDirective<HTMLElement, unknown> = {
    mounted(element, binding) {
        values.set(element, binding.value)

        const listener = () => {
            console.log(values.get(element))
        }

        element.addEventListener('click', listener)
        listeners.set(element, listener)
    },

    updated(element, binding) {
        values.set(element, binding.value)
    },

    beforeUnmount(element) {
        const listener = listeners.get(element)

        if (listener) {
            element.removeEventListener('click', listener)
        }

        values.delete(element)
        listeners.delete(element)
    },
}

export default logDirective
