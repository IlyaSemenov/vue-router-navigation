import type { ComponentInternalInstance } from "vue"
import { getCurrentInstance, reactive, watchEffect } from "vue"
import type { RouteLocationMatched, RouteLocationNormalizedLoaded } from "vue-router"
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
export function useRouteNavigation(routeOverride?: RouteLocationNormalizedLoaded): RouteNavigation {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error("useRouteNavigation() must be called during component setup()")
  }

  // Hotfix for Nuxt compatibility.
  // TODO: add dedicted Nuxt module.
  const route = routeOverride ?? useRoute()

  const reactiveNavigation = reactive({} as unknown as RouteNavigation)
  watchEffect(() => {
    const routeRecord = findRouteRecord(route.matched, instance)
    if (!routeRecord) {
      throw new Error("useRouteNavigation() must be used inside a route component.")
    }
    const navigation = createRouteNavigation(route.path, routeRecord.path)
    Object.assign(reactiveNavigation, navigation)
  })

  return reactiveNavigation
}

/**
 * Loop up the component tree to find the innermost matched route record.
 */
function findRouteRecord(routeRecords: RouteLocationMatched[], instance: ComponentInternalInstance) {
  for (let i = instance; i; i = i.parent!) {
    // Innermost route records go last.
    const routeRecord = routeRecords.findLast(r => r.components?.default === i.type)
    if (routeRecord) {
      return routeRecord
    }
  }
  return undefined
}
