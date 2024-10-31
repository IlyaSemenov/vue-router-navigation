export interface RouteNavigation {
  /** @example "/orders/123" */
  prefix: string
  /** @example "settings" */
  // Key always defined, so that toRefs() can be used.
  page: string | undefined
}

/**
 * @param routePath Actual route path, such as `/orders/123/details/billing`
 * @param componentPath Parent route definition path, possibly including placeholders, such as `/orders/:id`
 */
export function createRouteNavigation(routePath: string, componentPath: string): RouteNavigation {
  // TODO: micro-optimize
  const segment = componentPath.replace(/\/$/, "").split("/").length
  const parts = routePath.split("/")
  const prefix = parts.slice(0, segment).join("/")
  const page = parts[segment] || undefined
  return { prefix, page }
}
