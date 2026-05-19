<script setup lang="ts">
import type { Route } from '../types'
import { derivePrefix } from '../utils/generateConfig'

defineProps<{ routes: Route[] }>()
const emit = defineEmits<{
    add: []
    delete: [id: string]
    update: [route: Route]
}>()

function handleDomainChange(route: Route, value: string) {
    emit('update', {
        ...route,
        domain: value,
        prefix: derivePrefix(value),
    })
}
</script>

<template>
    <a-list :bordered="false">
        <template #header>
            Routes ({{ routes.length }})
        </template>
        <a-list-item v-for="route in routes" :key="route.id">
            <a-space size="medium">
                <a-input :model-value="route.domain" class="route-domain" placeholder="e.g. app.example.com"
                    @input="(v: string) => handleDomainChange(route, v)" />
                <span class="route-arrow">→</span>
                <a-space size="mini">
                    <a-input :model-value="route.host" placeholder="Host" style="width: 140px;"
                        @input="(v: string) => emit('update', { ...route, host: v })" />
                    <a-input-number :model-value="route.port" :min="1" :max="65535" placeholder="Port"
                        style="width: 100px;"
                        @change="(v: number | undefined) => emit('update', { ...route, port: v ?? 80 })" />
                </a-space>
                <a-input :model-value="route.prefix" placeholder="Prefix" style="width: 130px;"
                    @input="(v: string) => emit('update', { ...route, prefix: v })" />
                <a-popconfirm content="Delete this route?" @ok="emit('delete', route.id)">
                    <a-button type="text" status="danger">
                        <icon-delete />
                    </a-button>
                </a-popconfirm>
            </a-space>
        </a-list-item>
        <template #footer>
            <a-button type="text" long @click="emit('add')">
                <icon-plus />
                Add Route
            </a-button>
        </template>
    </a-list>
</template>
