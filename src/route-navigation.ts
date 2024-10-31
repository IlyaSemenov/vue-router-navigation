import { getCurrentInstance, reactive, watchEffect } from "vue"
import { useRoute } from "vue-router"

import type { RouteNavigation } from "./parse"
import { createRouteNavigation } from "./parse"

/**
 * When called inside a parent route component, return the prefix and the immediately nested page of the route path.
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
 *   page: "details"
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
