# vue-router-navigation

`vue-router` helper for generating navigation links when using deeply nested paths.

## Install

```sh
npm install vue-router-navigation
```

## Use

Given a set of nested `vue-router` pages, such as:

- `/orders/123` — main order page
- `/orders/123/details/address` — order address details
- `/orders/123/details/billing` — order billing details
- `/orders/123/tracking` — order tracking

Generate navigation links for Order, Details and Tracking in `pages/orders/[order_id].vue`:

```vue
<script setup lang="ts">
import { useRoutePathNavigation } from "vue-router-navigation"

const { prefix } = useRoutePathNavigation()
</script>

<template>
  <div>
    <nuxt-link :href="prefix">
      Order
    </nuxt-link>
    <nuxt-link :href="`${prefix}/details`">
      Details
    </nuxt-link>
    <nuxt-link :href="`${prefix}/tracking`">
      Tracking
    </nuxt-link>
  </div>
  <router-view />
</template>
```

Generate navigation links for Address and Billing in `pages/orders/[order_id]/details.vue`:

```vue
<script setup lang="ts">
import { useRoutePathNavigation } from "vue-router-navigation"

const { prefix, page } = useRoutePathNavigation()
</script>

<template>
  <div>
    <nuxt-link :href="`${prefix}/address`">
      Address
    </nuxt-link>
    <nuxt-link :href="`${prefix}/billing`">
      Billing
    </nuxt-link>
  </div>
  <router-view />
</template>
```

### Active page

Sometimes vue-router auto-injected CSS classes are not enough. You can explicitly check the active page with:

```vue
<script setup lang="ts">
import { useRoutePathNavigation } from "vue-router-navigation"

const { prefix, page } = useRoutePathNavigation()
</script>

<template>
  <ul>
    <li :class="{ active: !page }">
      <nuxt-link :href="prefix">
        Order
      </nuxt-link>
    </li>
    <li :class="{ active: page === 'details' }">
      <nuxt-link :href="`${prefix}/details`">
        Details
      </nuxt-link>
    </li>
    <li :class="{ active: page === 'tracking' }">
      <nuxt-link :href="`${prefix}/tracking`">
        Tracking
      </nuxt-link>
    </li>
  </ul>
  <router-view />
</template>
```
