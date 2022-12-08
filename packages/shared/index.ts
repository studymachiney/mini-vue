export const extend = Object.assign

export function isObject(value): value is Record<any, any> {
  return typeof value === 'object' && value !== null
}
