import { defineStore } from "pinia";

// Define el tipo de los power-ups
interface PowerUp {
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  active: boolean;
}

interface ClickerPowerUpsState {
  powerUps: {
    [key: string]: PowerUp;
  };
}

export const useCounterStore = defineStore("counter", {
  state: () => ({
    countClicks: 0,
    aumentator: 1,
  }),
  actions: {
    increment() {
      const powerUps = useClickerPowerUps();
      let multiplier = this.aumentator;

      // Aseguramos que el índice de powerUps sea correcto
      for (const key in powerUps.powerUps) {
        const powerUpKey = key as keyof ClickerPowerUpsState['powerUps']; // Corrección aquí
        if (powerUps.powerUps[powerUpKey].active) {
          multiplier *= powerUps.powerUps[powerUpKey].multiplier;
        }
      }

      this.countClicks += multiplier;
      this.saveState();
    },
    changeAumentator(value: number) {
      this.aumentator = value;
      this.saveState();
    },
    saveState() {
      localStorage.setItem("counterStore", JSON.stringify(this.$state));
    },
    loadState() {
      const data = localStorage.getItem("counterStore");
      if (data) {
        this.$patch(JSON.parse(data));
      }
    },
  },
});
export const useClickerPowerUps = defineStore("clickerPowerUps", {
  state: (): ClickerPowerUpsState => ({
    powerUps: {
      doubleClick: {
        name: "Doble Click",
        description: "Duplica los clicks",
        cost: 10,
        multiplier: 2,
        active: false,
      },
      tripleClick: {
        name: "Triple Click",
        description: "Triplica los clicks",
        cost: 20,
        multiplier: 3,
        active: false,
      },
      autoClick: {
        name: "Auto Click",
        description: "Genera un click automático por segundo",
        cost: 50,
        multiplier: 1,
        active: false,
      },
      megaClick: {
        name: "Mega Click",
        description: "Quíntuplica los clicks",
        cost: 100,
        multiplier: 5,
        active: false,
      },
      superMultiplier: {
        name: "Super Multiplicador",
        description: "Multiplica por 10 los clicks",
        cost: 500,
        multiplier: 10,
        active: false,
      },
      informationMarkee: {
        name: "Markee de Información",
        description: "Muestra un mensaje informativo",
        cost: 200,
        multiplier: 1,
        active: false,
      },
      catRain: {
        name: "Lluvia de Gatos",
        description: "Genera una lluvia de gatos en la pantalla",
        cost: 300,
        multiplier: 1,
        active: false,
      },
      x2AutoClicker: {
        name: "AutoClicker x2",
        description: "Duplica la velocidad del auto-click",
        cost: 400,
        multiplier: 2,
        active: false,
      },
      randomBonus: {
        name: "Bono Aleatorio",
        description: "Otorga un bono aleatorio de multiplicador",
        cost: 600,
        multiplier: 1,
        active: false,
      },
      ovenBonus: {
        name: "Bono Horno",
        description: "Cada 10 clicks sale un horno y si lo clickeas obtienes un bono",
        cost: 700,
        multiplier: 1,
        active: false,
      },
    },
  }),
  actions: {
    togglePowerUp(powerUp: string) {
      if (this.powerUps[powerUp]) {
        this.powerUps[powerUp].active = !this.powerUps[powerUp].active;
        this.saveState();
      }
    },
    saveState() {
      localStorage.setItem("clickerPowerUps", JSON.stringify(this.$state));
    },
    loadState() {
      const data = localStorage.getItem("clickerPowerUps");
      if (data) {
        this.$patch(JSON.parse(data));
      }
    },
  },
});

