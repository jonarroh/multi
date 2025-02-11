<template>
	<div
		class="w-screen h-screen flex flex-col items-center justify-center bg-gray-900"
	>
		<!-- Indicador para cambiar la fase actual (esto es opcional, para pruebas) -->
		<div class="mt-4 text-white">
			<Input
				type="text"
				v-model="password"
				class="rounded-md"
				placeholder="Password"
			/>
			<label for="face" class="text-white">Fase actual:</label>
			<select id="face" v-model.number="actualFace">
				<option v-for="n in 20" :key="n" :value="n">
					Face {{ n }}
				</option>
			</select>
		</div>

		<!-- Se muestran solo las fases hasta la actual -->
		<div class="mt-4 w-full max-w-md">
			<div
				v-for="face in visibleFaces"
				:key="face.number"
				class="flex justify-between items-center p-2 border border-gray-700 text-white rounded-md bg-gray-800 mb-2"
			>
				<div class="font-bold">Face {{ face.number }}</div>
				<div class="flex items-center">
					<span v-if="face.valid" class="text-green-400 mr-2"
						>✅</span
					>
					<span v-else class="text-red-400 mr-2">❌</span>
					<span v-if="!face.valid" class="text-sm">{{
						face.errorMessage
					}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Input } from './components/ui/input';
import { validateFaces } from './valid';
import { passwordFaceSchemas } from './valid';

const password = ref<string>('');
const actualFace = ref<number>(1);

// Computed que recorre las fases definidas y devuelve la validación para cada una,
// pero solo para aquellas cuyo número es menor o igual a actualFace.
const visibleFaces = computed(() => {
	return validateFaces({
		actualFace: actualFace.value,
		passwordFaceSchemas,
		actualValue: password.value
	}).map(({ number, isValid }) => {
		// Busca el esquema de la fase correspondiente
		const schema = passwordFaceSchemas.find(
			(face: { number: number }) => face.number === number
		)?.schema;

		return {
			number,
			valid: isValid,
			errorMessage: schema
				? // Si la fase no es válida, se muestra el mensaje de error existente en el esquema
				  passwordFaceSchemas[number - 1].errorMessages || ''
				: ''
		};
	});
});
</script>
