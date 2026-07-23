import { getApiData } from '@/utils/api'
import { http } from '@/utils/http'

import { createMenuResponseMock } from './mock'
import { menuResponseSchema, type MenuResponse } from './schema'

export async function getMenu(): Promise<MenuResponse> {
    return getApiData({
        schema: menuResponseSchema,
        request: () => http.get('/menu'),
        mock: createMenuResponseMock,
    })
}
