<script setup lang="ts">
import { Message } from '@arco-design/web-vue'

defineProps<{ yaml: string }>()

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    Message.success('Copied to clipboard')
  } catch {
    Message.error('Failed to copy')
  }
}
</script>

<template>
  <a-card
    class="preview-card"
    title="Generated Traefik Config"
    :bordered="true"
  >
    <template #extra>
      <a-button
        size="small"
        :disabled="!yaml"
        @click="copy(yaml)"
      >
        <icon-copy />
        Copy
      </a-button>
    </template>
    <div class="preview-code">
      <highlightjs
        v-if="yaml"
        language="yaml"
        :code="yaml"
      />
      <div v-else class="preview-empty">
        Add a route to see the generated config
      </div>
    </div>
  </a-card>
</template>
