<script setup lang="ts">
import { ref, computed } from 'vue'
import { generateYaml } from './utils/generateConfig'
import type { Route } from './types'
import RouteList from './components/RouteList.vue'
import ConfigPreview from './components/ConfigPreview.vue'

let nextId = 0

const routes = ref<Route[]>([
    {
        id: String(nextId++),
        domain: '',
        host: '',
        port: undefined,
        prefix: '',
    }
])

const yaml = computed(() => generateYaml(routes.value))

function addRoute() {
    routes.value.push({
        id: String(nextId++),
        domain: '',
        host: '',
        port: 80,
        prefix: '',
    })
}

function deleteRoute(id: string) {
    routes.value = routes.value.filter((r) => r.id !== id)
}

function updateRoute(route: Route) {
    const idx = routes.value.findIndex((r) => r.id === route.id)
    if (idx !== -1) {
        routes.value[idx] = route
    }
}
</script>

<template>
    <a-layout>
        <a-layout-header>
            <a-page-header title="Dynamic Proxies" subtitle="Traefik Dynamic Config Generator" :show-back="false">
            </a-page-header>
        </a-layout-header>
        <a-layout-content style="padding: 0.3em">
            <a-space direction="vertical" fill>
                <RouteList :routes="routes" @add="addRoute" @delete="deleteRoute" @update="updateRoute" />
                <ConfigPreview :yaml="yaml" />
            </a-space>
        </a-layout-content>
        <a-layout-footer>
            <a-space fill>
                <a-typography>Copyright ©️2026 Shengchen Zhang</a-typography>
            </a-space>
        </a-layout-footer>
    </a-layout>
</template>

<style>
body {
    margin: 0;
    background: var(--color-neutral-2);
}

#app {
    max-width: 60rem;
    margin: 0 auto;
    margin-top: 1rem;
    padding: 32px 48px;
    background: var(--color-bg-1);
}

.route-arrow {
    color: var(--color-text-4);
    font-size: 18px;
    flex: none;
    user-select: none;
}

.route-domain {
    flex: 2;
    min-width: 0;
}

.preview-code code {
    font-size: 13px;
    line-height: 1.5;
}

.preview-empty {
    color: var(--color-text-3);
    padding: 16px;
    text-align: center;
}
</style>