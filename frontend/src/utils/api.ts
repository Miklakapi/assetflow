import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { z } from 'zod'

import { ContractValidationError, parseContract } from '@/utils/schema'

export type DataErrorKind =
    'canceled' | 'timeout' | 'network' | 'response' | 'invalid-response' | 'invalid-contract' | 'unknown'

export interface DataError {
    kind: DataErrorKind
    message: string
    status: number | null
    url: string | null
    code: string | null
    details: unknown
    originalError: unknown
}

interface ErrorResponse {
    message?: unknown
    detail?: unknown
    title?: unknown
    error?: unknown
    errors?: unknown
}

interface ApiDataOptions<TSchema extends z.ZodType> {
    schema: TSchema
    request: () => Promise<AxiosResponse<unknown>>
    mock?: () => unknown | Promise<unknown>
}

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

export async function getApiData<TSchema extends z.ZodType>(
    options: ApiDataOptions<TSchema>,
): Promise<z.output<TSchema>> {
    if (useMocks) {
        return getMockData(options)
    }

    return getRequestData(options)
}

export function toDataError(error: unknown): DataError {
    if (error instanceof ContractValidationError) {
        return {
            kind: 'invalid-contract',
            message: 'The received data does not match the expected contract.',
            status: null,
            url: error.source,
            code: null,
            details: {
                issues: error.issues,
                receivedData: error.receivedData,
            },
            originalError: error,
        }
    }

    if (!axios.isAxiosError(error)) {
        return {
            kind: 'unknown',
            message: getUnknownErrorMessage(error),
            status: null,
            url: null,
            code: null,
            details: null,
            originalError: error,
        }
    }

    if (error.code === 'ERR_CANCELED') {
        return {
            kind: 'canceled',
            message: 'Request was canceled.',
            status: null,
            url: buildRequestUrl(error.config),
            code: error.code,
            details: null,
            originalError: error,
        }
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return {
            kind: 'timeout',
            message: 'The request timed out.',
            status: null,
            url: buildRequestUrl(error.config),
            code: error.code,
            details: {
                timeout: error.config?.timeout ?? null,
            },
            originalError: error,
        }
    }

    if (!error.response) {
        return {
            kind: 'network',
            message: 'Could not connect to the server.',
            status: null,
            url: buildRequestUrl(error.config),
            code: error.code ?? null,
            details: null,
            originalError: error,
        }
    }

    return createResponseDataError(error)
}

async function getMockData<TSchema extends z.ZodType>(options: ApiDataOptions<TSchema>): Promise<z.output<TSchema>> {
    if (!options.mock) {
        throw new Error('Mocks are enabled, but no mock data source was provided.')
    }

    const data = await options.mock()

    return parseContract(options.schema, data, 'mock data')
}

async function getRequestData<TSchema extends z.ZodType>(options: ApiDataOptions<TSchema>): Promise<z.output<TSchema>> {
    const response = await options.request()
    const source = buildRequestSource(response)

    return parseContract(options.schema, response.data, source)
}

function createResponseDataError(error: AxiosError): DataError {
    const response = error.response
    const contentType = getContentType(response)
    const responseData = response?.data
    const status = response?.status ?? null
    const url = buildRequestUrl(error.config)

    if (isHtmlResponse(contentType, responseData)) {
        return {
            kind: 'invalid-response',
            message: buildUnexpectedResponseMessage(status),
            status,
            url,
            code: error.code ?? null,
            details: {
                contentType,
                preview: createResponsePreview(responseData),
            },
            originalError: error,
        }
    }

    return {
        kind: 'response',
        message: extractResponseMessage(responseData) ?? error.message ?? buildUnexpectedResponseMessage(status),
        status,
        url,
        code: error.code ?? null,
        details: responseData,
        originalError: error,
    }
}

function buildRequestSource(response: AxiosResponse<unknown>): string {
    const method = response.config.method?.toUpperCase() ?? 'REQUEST'
    const url = buildRequestUrl(response.config) ?? 'unknown URL'

    return `${method} ${url}`
}

function buildRequestUrl(config: AxiosRequestConfig | undefined): string | null {
    const baseUrl = config?.baseURL?.toString().replace(/\/+$/, '')
    const url = config?.url?.toString().replace(/^\/+/, '')

    if (!baseUrl) {
        return url || null
    }

    if (!url) {
        return baseUrl
    }

    if (/^https?:\/\//i.test(url)) {
        return url
    }

    return `${baseUrl}/${url}`
}

function extractResponseMessage(data: unknown): string | null {
    if (typeof data === 'string') {
        const value = data.trim()

        return value || null
    }

    if (!isRecord(data)) {
        return null
    }

    const response = data as ErrorResponse
    const candidates = [response.message, response.detail, response.title, response.error]

    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim()) {
            return candidate.trim()
        }
    }

    return null
}

function getContentType(response: AxiosResponse | undefined): string | null {
    const contentType = response?.headers?.['content-type']

    return typeof contentType === 'string' ? contentType.toLowerCase() : null
}

function isHtmlResponse(contentType: string | null, data: unknown): boolean {
    if (contentType?.includes('text/html')) {
        return true
    }

    if (typeof data !== 'string') {
        return false
    }

    const value = data.trim().toLowerCase()

    return value.startsWith('<!doctype html') || value.startsWith('<html') || value.includes('<body')
}

function createResponsePreview(data: unknown): string | null {
    if (typeof data !== 'string') {
        return null
    }

    const plainText = data
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    if (!plainText) {
        return null
    }

    return plainText.slice(0, 500)
}

function buildUnexpectedResponseMessage(status: number | null): string {
    if (status) {
        return `The server returned an unexpected response (${status}).`
    }

    return 'The server returned an unexpected response.'
}

function getUnknownErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message
    }

    return 'An unexpected error occurred.'
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}
