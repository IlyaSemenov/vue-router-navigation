import { expect, test } from "vitest"

import { createRouteNavigation } from "./route-navigation"

test("createRouteNavigation", () => {
  expect(createRouteNavigation("/orders/123", "/orders/:id")).toEqual({ prefix: "/orders/123", page: undefined })
  expect(createRouteNavigation("/orders/123/", "/orders/:id")).toEqual({ prefix: "/orders/123", page: undefined })
  expect(createRouteNavigation("/orders/123/details", "/orders/:id")).toEqual({ prefix: "/orders/123", page: "details" })
  expect(createRouteNavigation("/orders/123/details/", "/orders/:id")).toEqual({ prefix: "/orders/123", page: "details" })
  expect(createRouteNavigation("/orders/123/details/billing", "/orders/:id")).toEqual({ prefix: "/orders/123", page: "details" })
  expect(createRouteNavigation("/orders/123/details/billing/refund", "/orders/:id")).toEqual({ prefix: "/orders/123", page: "details" })
})
