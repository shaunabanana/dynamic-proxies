import yaml from 'js-yaml'
import type { Route } from '../types'

export function derivePrefix(domain: string): string {
  const parts = domain.split('.')
  if (parts.length < 2) return domain

  const withoutTld = parts.slice(0, -1)
  const subdomains = withoutTld.slice(0, -1)

  if (subdomains.length === 0) return withoutTld[0] || domain

  return subdomains.reverse().join('-')
}

export function generateYaml(routes: Route[]): string {
  const config: Record<string, unknown> = {
    http: {
      middlewares: {},
      routers: {},
      services: {
        noop: {
          loadBalancer: {
            servers: [{ url: '' }],
          },
        },
      },
    },
  }

  for (const route of routes) {
    if (!route.domain || !route.host || !route.port) continue

    const p = route.prefix

    ;(config.http as any).middlewares[`${p}-redirect-to-https`] = {
      redirectScheme: { scheme: 'https' },
    }

    ;(config.http as any).routers[`${p}-http`] = {
      entryPoints: ['http'],
      rule: `Host(\`${route.domain}\`)`,
      middlewares: [`${p}-redirect-to-https`],
      service: 'noop',
    }

    ;(config.http as any).routers[`${p}-https`] = {
      entryPoints: ['https'],
      rule: `Host(\`${route.domain}\`)`,
      service: `${p}-service`,
      tls: { certResolver: 'letsencrypt' },
    }

    ;(config.http as any).services[`${p}-service`] = {
      loadBalancer: {
        servers: [{ url: `http://${route.host}:${route.port}` }],
      },
    }
  }

  return yaml.dump(config, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    quotingType: "'",
    forceQuotes: false,
  })
}
