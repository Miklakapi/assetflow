import type { AxiosResponse } from 'axios'
import { z } from 'zod'

import { parseContract } from '@/utils/schema'

export async function requestValidated<TSchema extends z.ZodType>(
    request: Promise<AxiosResponse<unknown>>,
    schema: TSchema,
): Promise<z.output<TSchema>> {
    const response = await request
    const source = buildResponseSource(response)

    return parseContract(schema, response.data, source)
}

function buildResponseSource(response: AxiosResponse<unknown>): string | undefined {
    const baseUrl = response.config.baseURL?.replace(/\/+$/, '')
    const url = response.config.url?.replace(/^\/+/, '')

    if (!baseUrl) {
        return url
    }

    if (!url) {
        return baseUrl
    }

    if (/^https?:\/\//i.test(url)) {
        return url
    }

    return `${baseUrl}/${url}`
}
