<script setup lang="ts">
import { ref } from "vue";

import EOTranslator from "../../../../src/index";
import { GREETING_DICTIONARY } from "../demos";
import LanguagePicker from "./language-picker.vue";



const translator = new EOTranslator(GREETING_DICTIONARY, "en");
const language = ref("en");
const name = ref("");
const output = ref("");

/**
 * @description
 * Translate the greeting into the picked language
 */
function greet(): void {
  output.value = translator.translate("greeting", {
    lang: language.value,
    params: { name: name.value || "EOussama" },
  });
}
</script>

<template>
  <div class="demo">
    <div class="demo__controls">
      <LanguagePicker v-model="language" />
      <label class="demo__field">
        <span>Greeted name</span>
        <input v-model="name" class="demo__control" type="text" placeholder="EOussama" data-testid="demo-name">
      </label>
      <button class="demo__button" type="button" data-testid="demo-greet" @click="greet">
        Greet
      </button>
    </div>
    <output class="demo__output" data-testid="demo-output">{{ output }}</output>
  </div>
</template>
