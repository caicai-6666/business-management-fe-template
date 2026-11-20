<script setup>
import { ref } from 'vue'
const draft = ref('')
</script>

<template>
  <section>
    <div class="sheet">
      <h1>随手记</h1>
      <p>写下此刻的想法。切换页面会保留草稿，刷新后清空。</p>
      <div class="notebook">
        <label for="draft">我的草稿</label>
        <textarea id="draft" v-model="draft" placeholder="从这里开始记录…" />
      </div>
    </div>
  </section>
</template>
