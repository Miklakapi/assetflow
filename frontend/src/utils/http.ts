import axios from 'axios'

function normalizeApiUrlPrefix(value: string | undefined): string {
    const prefix = value?.trim().replace(/^\/+|\/+$/g, '')

    return prefix || 'api'
}

const apiUrlPrefix = normalizeApiUrlPrefix(import.meta.env.VITE_API_URL_PREFIX)

export const http = axios.create({
    baseURL: `/${apiUrlPrefix}`,
    withCredentials: true,
    timeout: 15_000,
})
