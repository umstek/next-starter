import { ZodError, ZodFormattedError } from 'zod';

export function formatError<T>(e: ZodError<T>) {
  const o: Partial<ZodFormattedError<T, string>> &
    Omit<ZodFormattedError<T>, '_errors'> = e.format();
  delete o._errors;
  return Object.entries(o as { [k: string]: any })
    .map(([k, v]) => `${k}: ${v._errors.join(', ')}`)
    .join('\n');
}
