import { sendMessage } from 'webext-bridge'

export async function rememberResources(
    items: { name: string; url: string; ex: number }[],
) {
    const result = await sendMessage('remember-resources', { items })
    if (result.isError) {
        throw result.error
    }
    return result.data
}

export async function updateResources(
    items: { id: number; name: string; url: string }[],
) {
    const result = await sendMessage('update-resources', { items })
    if (result.isError) {
        throw result.error
    }
    return result.data
}
