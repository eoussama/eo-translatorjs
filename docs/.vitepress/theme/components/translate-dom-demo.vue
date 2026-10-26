<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import EOTranslator from "../../../../src/index";
import { informDictionary } from "../demos";
import LanguagePicker from "./language-picker.vue";



const translator = new EOTranslator(informDictionary(true), "en");
const language = ref("en");
const container = ref<HTMLElement | null>(null);

/**
 * @description
 * Translate every marked element of the demo into the picked language
 */
function translate(): void {
  translator.translateDOM(container.value, language.value);
}

onMounted(translate);
watch(language, translate);
</script>

<template>
  <div ref="container" class="demo">
    <div class="demo__controls">
      <LanguagePicker v-model="language" />
    </div>
    <div
      class="demo__output"
      data-testid="demo-output"
      eo-translator="inform"
      eo-translator-html="true"
      eo-translator-params="{ &quot;pet-name&quot;: &quot;Riley&quot;, &quot;owner-name&quot;: &quot;Claire&quot; }"
      eo-translator-fallback="This is a fallback translation for when the targeted translation is not found."
    />
  </div>
</template>
