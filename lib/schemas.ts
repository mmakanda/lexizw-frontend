import { z } from 'zod'

const CONTROL_CHARS = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g

export const searchSchema = z.object({
  query: z.string()
    .min(3, 'Query must be at least 3 characters')
    .max(500, 'Query too long (max 500 characters)')
    .transform(v => v.replace(CONTROL_CHARS, '').trim()),
  search_type: z.enum(['research', 'sentencing', 'acts']).default('research'),
  filters: z.array(z.string()).default([]),
})

export const draftSchema = z.object({
  template_type: z.enum(['nda','employment','lease','deed_of_sale','affidavit','service_agreement','debt_acknowledgment']),
  fields: z.record(z.string().max(2000)),
  language: z.enum(['en','sn','nd']).default('en'),
})

export const formSchema = z.object({
  form_type: z.enum(['hc12_summons','magistrates_summons','chamber_application','opposing_affidavit','notice_of_motion','mitigation_letter']),
  fields: z.record(z.string().max(2000)),
  language: z.enum(['en','sn']).default('en'),
})

export const sentencingSchema = z.object({
  offence: z.string().min(3).max(200),
  offence_details: z.string().min(10).max(1000),
  is_first_offender: z.boolean().default(true),
  mitigating_factors: z.array(z.string()).default([]),
  aggravating_factors: z.array(z.string()).default([]),
  value_involved: z.number().min(0).optional(),
})

export type SearchInput    = z.infer<typeof searchSchema>
export type DraftInput     = z.infer<typeof draftSchema>
export type FormInput      = z.infer<typeof formSchema>
export type SentencingInput = z.infer<typeof sentencingSchema>
