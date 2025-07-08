/**
 * Build-time safety guards for static generation
 */

export const isBuildTime = () => {
  return process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== undefined
}

export const isStaticGeneration = () => {
  return typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build'
}

export const safeAsyncData = async <T>(
  asyncFn: () => Promise<T>,
  fallback: T,
  errorMessage?: string
): Promise<T> => {
  try {
    if (isBuildTime()) {
      console.warn(errorMessage || 'Skipping async operation during build time')
      return fallback
    }
    return await asyncFn()
  } catch (error) {
    console.error('Error in async operation:', error)
    return fallback
  }
}

export const withBuildGuard = <T>(
  clientValue: T,
  serverValue: T
): T => {
  if (typeof window === 'undefined') {
    return serverValue
  }
  return clientValue
}

export const requiresRuntime = (componentName: string) => {
  if (isStaticGeneration()) {
    console.warn(`${componentName} requires runtime and will be skipped during static generation`)
    return false
  }
  return true
}