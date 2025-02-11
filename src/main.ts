import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/wordle',
			component: () => import('./pages/wordle/index.vue')
		}
	]
});

const pinia = createPinia();
createApp(App).use(router).use(pinia).mount('#app');
