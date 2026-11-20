export const platformName = '管理工作台'

export const navigation = [
  { name: 'notes', path: '/', label: '随手记', component: () => import('../views/NotesView.vue') },
  { name: 'guide', path: '/guide', label: '使用指南', component: () => import('../views/GuideView.vue') },
]
