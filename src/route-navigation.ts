import { getCurrentInstance, reactive, watchEffect } from "vue"
import { useRoute } from "vue-router"

export interface RouteNavigation {
  /** @example "/orders/123" */
  prefix: string
  /** @example "settings" */
  // Key always defined, so that toRefs() can be used.
  page: string | undefined
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
    throw new Error("useRouteNavigation() must be called during component setup()")
  }

  const reactiveNavigation = reactive({} as unknown as RouteNavigation)
  watchEffect(() => {
    const componentRoute = route.matched.find(r => r.components?.default === instance.type)
    if (!componentRoute) {
      throw new Error("useRouteNavigation() must be used inside a route component.")
    }
    const navigation = createRouteNavigation(route.path, componentRoute.path)
    Object.assign(reactiveNavigation, navigation)
  })

  return reactiveNavigation
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
