<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { navigation, platformName } from '../config/platform.js'

const route = useRoute()
const activeIndex = computed(() => navigation.findIndex(item => item.name === route.name))
const direction = ref('forward')
watch(activeIndex, (next, previous) => {
  direction.value = next >= previous ? 'forward' : 'backward'
})

function enablePage(element) { element.inert = false }
function disablePage(element) { element.inert = true }
</script>

<template>
  <div class="workspace" data-molecular-field-block>
    <header>
      <strong class="brand"><i aria-hidden="true"></i>{{ platformName }}</strong>
      <nav aria-label="工作台导航" :style="{ '--count': navigation.length, '--index': activeIndex }">
        <span v-if="activeIndex >= 0" class="indicator" aria-hidden="true"></span>
        <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.name }">
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>
    <main>
      <RouterView v-slot="{ Component, route: current }">
        <Transition :name="direction" @before-enter="enablePage" @before-leave="disablePage" @leave-cancelled="enablePage">
          <KeepAlive :max="navigation.length">
            <component :is="Component" :key="current.name" class="page" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
