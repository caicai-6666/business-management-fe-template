import { createRouter, createWebHistory } from 'vue-router'
import { navigation, platformName } from '../config/platform.js'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...navigation.map(({ name, path, component, label }) => ({
      name, path, component, meta: { title: label },
    })),
    { path: '/:pathMatch(.*)*', redirect: { name: navigation[0].name } },
  ],
})

router.afterEach(to => {
  document.title = [to.meta.title, platformName].join(' · ')
})
