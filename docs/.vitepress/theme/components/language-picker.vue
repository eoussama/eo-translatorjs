<script setup lang="ts">
import { DEMO_LANGUAGES } from "../demos";



const language = defineModel<string>({ required: true });
</script>

<template>
  <label class="demo__field">
    <span>Translation language</span>
    <select v-model="language" class="demo__control" data-testid="demo-language">
      <option v-for="lang in DEMO_LANGUAGES" :key="lang.code" :value="lang.code">
        {{ lang.name }}
      </option>
    </select>
  </label>
</template>
