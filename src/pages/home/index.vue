<template>
  <div class="flex flex-col items-center gap-4 p-6">

    <h1 class="text-4xl font-bold">Clicker Game</h1>

    <!-- sona del markee -->
    <div v-if="warkeeActive" class="markee">
      <marquee>
        <h2>
          jajaja, ¡haz clic en el botón!
        </h2>
      </marquee>
    </div>

    <p>
      Clicks: {{ counterStore.countClicks }} - Aumento: {{ aumentator }}
    </p>
    <button ref="button" @click="animateNumber" 
      class="bg-black text-white px-6 py-3 text-lg font-bold border-4 border-white shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-transform">
      Haz Click (+{{ aumentator }})
    </button>
    
    <div class="relative w-full h-32">
      <div 
        v-for="(number, index) in numbers" 
        :key="index" 
        class="animated-number number-active" 
        :style="{
          left: `${number.left}px`,
          top: `${number.top}px`
        }"
      >
        {{ number.value }}
      </div>
    </div>
    
    <div class="flex gap-4">
      <button v-for="(powerUp, key) in visiblePowerUps" :key="key" @click="togglePowerUp(key)"
        class="px-4 py-2 bg-blue-500 text-white font-bold border-2 border-black shadow-[3px_3px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-transform"
        :class="{ 'bg-green-500': powerUp.active }">
        {{ powerUp.name }} ({{ powerUp.cost }} puntos)
      </button>
    </div>
    
    <!-- Sección para mostrar los hornos -->
    <div v-if="powerUpStore.powerUps['ovenBonus'].active">
      <div v-for="(oven, index) in ovens" :key="index" class="oven" @click="collectOvenBonus">
        ¡Horno! (+{{ oven.value }})
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useCounterStore, useClickerPowerUps } from './store/counterSlide';

const numbers = ref<{ left: number; top: number; value: number }[]>([]);
const button = ref<HTMLElement | null>(null);
const ovens = ref<{ value: number }[]>([]);
const warkeeActive = ref<boolean>(false);
const counterStore = useCounterStore();
const powerUpStore = useClickerPowerUps();

onMounted(() => {
  counterStore.loadState();
  powerUpStore.loadState();
});

const aumentator = computed(() => {
  let multiplier = 1;
  Object.values(powerUpStore.powerUps).forEach(powerUp => {
    if (powerUp.active) multiplier *= powerUp.multiplier;
  });
  return counterStore.aumentator * multiplier;
});

// AutoClicker: Comienza solo cuando el powerUp "autoClick" está activo
watchEffect(() => {
  if (powerUpStore.powerUps['autoClick'].active) {
    setInterval(() => {
      counterStore.increment();
    }, 1000);
  }
});

// Lógica del power-up 'ovenBonus'
watchEffect(() => {
  if (powerUpStore.powerUps['ovenBonus'].active && counterStore.countClicks % 10 === 0) {
    ovens.value.push({ value: 5 }); // Agrega un horno con valor 5
  }
});

// Logica para mostrar el markee
watchEffect(() => {
  if (powerUpStore.powerUps['informationMarkee'].active) {
    warkeeActive.value = true;
    setTimeout(() => {
      warkeeActive.value = false;
    }, 5000);
  }
});

const animateNumber = () => {
  if (!button.value) return;
  const rect = button.value.getBoundingClientRect();
  
  counterStore.increment();
  
  const newNumber = {
    left: rect.left + rect.width / 2,
    top: rect.top,
    value: aumentator.value,
  };
  
  numbers.value.push(newNumber);
  
  setTimeout(() => {
    numbers.value.shift();
  }, 1000);
};

const powerUps = computed(() => powerUpStore.powerUps);

const visiblePowerUps = computed(() => {
  return Object.entries(powerUpStore.powerUps)
    .filter(([_, powerUp]) => !powerUp.active)
    .slice(0, 3)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
});

const togglePowerUp = (key: string) => {
  if (counterStore.countClicks >= powerUps.value[key].cost) {
    counterStore.countClicks -= powerUps.value[key].cost;
    powerUpStore.togglePowerUp(key);
  }
};

// Función para recoger el bono de horno
const collectOvenBonus = () => {
  ovens.value.pop(); // Elimina el horno después de hacer clic
  counterStore.countClicks += 5; // Agrega el bono de 5 puntos al contador
};
</script>

<style>
.animated-number {
  position: absolute;
  opacity: 0;
  font-size: 48px;
  color: blue;
  transition: all 0.5s ease-out;
}

.number-active {
  animation: popOut 1s forwards;
}

@keyframes popOut {
  0% {
    transform: scale(0.5) translateY(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.5) translateY(-50px);
    opacity: 1;
  }
  100% {
    transform: scale(2) translateY(-150px);
    opacity: 0;
  }
}

.oven {
  margin-top: 10px;
  padding: 10px;
  background-color: #f1c40f;
  border-radius: 5px;
  cursor: pointer;
}
</style>
