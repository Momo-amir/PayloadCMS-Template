import { register } from 'node:module'

register(import.meta.url)

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.endsWith('.scss')) {
    return {
      shortCircuit: true,
      url: new URL('data:text/javascript,export default {}').href,
    }
  }
  return defaultResolve(specifier, context)
}

export async function load(url, context, defaultLoad) {
  if (url.startsWith('data:text/javascript,export default {}')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {}',
    }
  }
  return defaultLoad(url, context)
}

// This loader allows ignoring SCSS imports - Temporary fix for Payload CMS CLI issues
