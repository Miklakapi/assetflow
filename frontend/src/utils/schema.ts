import { z } from 'zod'

export class ContractValidationError extends Error {
    readonly issues: z.core.$ZodIssue[]
    readonly receivedData: unknown
    readonly source: string | null

    constructor(issues: z.core.$ZodIssue[], receivedData: unknown, source?: string) {
        const message = source ? `Invalid data contract: ${source}` : 'Invalid data contract.'

        super(message)

        this.name = 'ContractValidationError'
        this.issues = issues
        this.receivedData = receivedData
        this.source = source ?? null
    }
}

export function parseContract<TSchema extends z.ZodType>(
    schema: TSchema,
    data: unknown,
    source?: string,
): z.output<TSchema> {
    const result = schema.safeParse(data)

    if (!result.success) {
        throw new ContractValidationError(result.error.issues, data, source)
    }

    return result.data
}
