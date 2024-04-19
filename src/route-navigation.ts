import { getCurrentInstance } from "vue"
import { useRoute } from "vue-router"

export interface RouteNavigation {
  /** @example "/orders/123" */
  prefix: string
  /** @example "settings" */
  page?: string
}

/**
 * When called inside a parent route component, return the prefix and section of the route path.
 *
 * For example, when:
 *
 * - the route path is `/orders/123/details/billing`
 * - called inside `[order_id].vue`
 *
 * it will return:
 *
 * ```
 * {
 *   prefix: "/orders/123",
 *   section: "details"
 * }
 * ```
 */
export function useRouteNavigation(): RouteNavigation {
  const route = useRoute()
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error("useRouteNavigation() must be called during setup().")
  }
  const componentRoute = route.matched.find(r => r.components?.default === instance.type)
  if (!componentRoute) {
    throw new Error("useRouteNavigation() must be called from a route component.")
  }
  return createRouteNavigation(route.path, componentRoute.path)
}

/**
 * @param routePath Actual route path, such as `/orders/123/details/billing`
 * @param componentPath Parent route definition path, possibly including placeholders, such as `/orders/:id`
 */
export function createRouteNavigation(routePath: string, componentPath: string): RouteNavigation {
  const segment = componentPath.split("/").length
  // TODO: micro-optimize
  const parts = routePath.split("/")
  const prefix = parts.slice(0, segment).join("/")
  const page = parts[segment] || undefined
  return { prefix, page }
}
