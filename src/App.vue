<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center bg-gray-900">
    <input
      type="text"
      v-model="password"
      class="bg-gray-800 text-white p-2 rounded-md"
      placeholder="Password"
    />

    <!-- Indicador para cambiar la fase actual (esto es opcional, para pruebas) -->
    <div class="mt-4 text-dark">
      <label for="face">Fase actual:</label>
      <select id="face" v-model.number="actualFace">
        <option v-for="n in 8" :key="n" :value="n">Face {{ n }}</option>
      </select>
    </div>

    <!-- Se muestran solo las fases hasta la actual -->
    <div class="mt-4 w-full max-w-md">
      <div
        v-for="face in visibleFaces"
        :key="face.number"
        class="flex justify-between items-center p-2 border-b border-gray-700 text-white"
      >
        <div class="font-bold">Face {{ face.number }}</div>
        <div class="flex items-center">
          <span v-if="face.valid" class="text-green-400 mr-2">✅</span>
          <span v-else class="text-red-400 mr-2">❌</span>
          <span v-if="!face.valid" class="text-sm">{{ face.errorMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { number, z } from 'zod'

/**
 * Función "builder" para generar un esquema de validación a partir de reglas.
 */
type RegexRule = {
  regex: RegExp
  message?: string
}

type RefineRule = {
  test: (value: string) => boolean
  message?: string
}

interface PasswordRules {
  minLength?: number
  regexRules?: RegexRule[]
  refineRules?: RefineRule[]
}

const createPasswordSchema = (rules: PasswordRules = {}): z.ZodString => {
  let schema = z.string()

  // Validación de longitud mínima
  if (rules.minLength) {
    schema = schema.min(rules.minLength, {
      message: `La contraseña debe tener al menos ${rules.minLength} caracteres`
    })
  }

  // Reglas de expresiones regulares
  rules.regexRules?.forEach((rule) => {
    schema = schema.regex(rule.regex, { message: rule.message })
  })

  // Validaciones personalizadas
  rules.refineRules?.forEach((rule) => {
    schema = schema.refine(rule.test, { message: rule.message }) as unknown as z.ZodString
  })

  return schema
}

// Expresión regular para detectar un elemento químico (sensible a mayúsculas)
const chemicalElementRegex = /H|He|Li|Be|B|C|N|O|F|Ne|Na|Mg|Al|Si|P|S|Cl|Ar|K|Ca|Sc|Ti|V|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Y|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|I|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|W|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|U|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Nh|Fl|Mc|Lv|Ts|Og/
 const eggEmojiRegex = /🥚/
  const spotlightNextToEggEmojiRegex = /🥚🔦|🔦🥚/
// Definición de cada fase ("face") con su respectivo esquema de validación.
const passwordFaceSchemas = [
  {
    number: 1,
    schema: createPasswordSchema({ minLength: 6 })
  },
  {
    number: 2,
    schema: createPasswordSchema({
      minLength: 6,
      regexRules: [{ regex: /\d/, message: 'Debe contener al menos un número' }]
    })
  },
  {
    number: 3,
    schema: createPasswordSchema({
      minLength: 6,
      regexRules: [
        { regex: /\d/, message: 'Debe contener al menos un número' },
        { regex: /\W/, message: 'Debe contener al menos un carácter especial' }
      ]
    })
  },
  {
    number: 4,
    schema: createPasswordSchema({
      minLength: 6,
      regexRules: [
        { regex: /\d/, message: 'Debe contener al menos un número' },
        { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
        { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' }
      ]
    })
  },
  {
    number: 5,
    schema: createPasswordSchema({
      minLength: 6,
      regexRules: [
        { regex: /\d/, message: 'Debe contener al menos un número' },
        { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
        { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
        { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' }
      ]
    })
  },
  {
    number: 6,
    schema: createPasswordSchema({
      minLength: 6,
      regexRules: [
        { regex: /\d/, message: 'Debe contener al menos un número' },
        { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
        { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
        { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' }
      ],
      refineRules: [
        {
          test: (value: string) => {
            // Sumar todos los dígitos encontrados
            const numbers = value.match(/\d/g) || []
            const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0)
            return sum === 25
          },
          message: 'La suma de los dígitos debe ser 25'
        }
      ]
    })
  },{
    number: 7,
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
    { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' },
    { regex: eggEmojiRegex, message: 'Debe contener al menos un emoji de huevo' }
  ],
  refineRules: [
    {
      test: (value: string) => {
        // Se extraen todos los dígitos y se suman
         const numbers = value.match(/\d/g) || [];
        const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 25;
      },
      message: 'La suma de los dígitos debe ser 25'
    }
  ],
  }
  ,
  {
    number: 8,
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
    { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' },
    { regex: eggEmojiRegex, message: 'Debe contener al menos un emoji de huevo' },
    { regex: spotlightNextToEggEmojiRegex, message: 'Debe contener un emoji de huevo seguido de un emoji de linterna' }
  ],
  refineRules: [
    {
      test: (value: string) => {
        // Se extraen todos los dígitos y se suman
         const numbers = value.match(/\d/g) || [];
        const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 25;
      },
      message: 'La suma de los dígitos debe ser 25'
    }
  ],
  }
]

// Variables reactivas para la contraseña ingresada y la fase actual
const password = ref<string>('')
const actualFace = ref<number>(1)

// Interfaz para la validación de cada fase
interface FaceValidation {
  number: number
  valid: boolean
  errorMessage: string
}

// Computed que recorre las fases definidas y devuelve la validación para cada una,
// pero solo para aquellas cuyo número es menor o igual a actualFace.
const visibleFaces = computed<FaceValidation[]>(() => {
  return passwordFaceSchemas
    .filter(faceSchema => faceSchema.number <= actualFace.value)
    .map(faceSchema => {
      try {
        faceSchema.schema?.parse(password.value)
        actualFace.value = faceSchema.number + 1

        return { number: faceSchema.number, valid: true, errorMessage: '' }
      } catch (error) {
        let message = ''
        if (error instanceof z.ZodError) {
          // Se obtiene el primer mensaje de error
          message = error.errors[0].message
        }
        return { number: faceSchema.number, valid: false, errorMessage: message }
      }
    })
})
</script>
