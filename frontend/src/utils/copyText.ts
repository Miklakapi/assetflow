export async function copyText(value: string): Promise<boolean> {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(value)

            return true
        } catch {
            return copyTextFallback(value)
        }
    }

    return copyTextFallback(value)
}

function copyTextFallback(value: string): boolean {
    const textarea = document.createElement('textarea')

    textarea.value = value
    textarea.readOnly = true
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.width = '1px'
    textarea.style.height = '1px'
    textarea.style.padding = '0'
    textarea.style.border = '0'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'

    document.body.append(textarea)

    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)

    let copied = false

    try {
        copied = document.execCommand('copy')
    } catch {
        copied = false
    }

    textarea.remove()

    return copied
}
