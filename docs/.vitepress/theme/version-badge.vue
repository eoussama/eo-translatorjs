<script setup lang="ts">
declare const __PKG_VERSION__: string;

const version = __PKG_VERSION__;
</script>

<template>
  <span class="vp-version-badge">v{{ version }}</span>
</template>

<style scoped>
.vp-version-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  padding: 2px 7px;
  border-radius: 10px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  margin-left: 8px;
  vertical-align: middle;
  letter-spacing: 0.02em;
  white-space: nowrap;
  font-family: var(--vp-font-family-mono);
}
</style>
