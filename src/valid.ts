import { z } from 'zod';

// Expresión regular para detectar elementos químicos (ejemplo básico)
const chemicalElementRegex =
	/H|He|Li|Be|B|C|N|O|F|Ne|Na|Mg|Al|Si|P|S|Cl|Ar|K|Ca|Sc|Ti|V|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Y|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|I|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|W|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|U|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Nh|Fl|Mc|Lv|Ts|Og/;
const eggEmojiRegex = /🥚/;
const spotlightNextToEggEmojiRegex = /🥚🔦|🔦🥚/;
const tulipanWitATurtle = /🌷🐢 | 🐢🌷/;
const numberRoman = /I|V|X|L|C|D|M/;

// Función para crear esquemas con diferentes reglas
const createPasswordSchema = ({
	minLength,
	regexRules = [],
	refineRules = []
}: {
	minLength: number;
	regexRules?: { regex: RegExp; message: string }[];
	refineRules?: {
		test: (value: string) => boolean;
		message: string;
	}[];
}) => {
	let schema = z
		.string()
		.min(minLength, `Debe tener al menos ${minLength} caracteres`);

	regexRules.forEach(({ regex, message }) => {
		schema = schema.regex(regex, message);
	});

	refineRules.forEach(({ test, message }) => {
		schema = schema.refine(test, {
			message
		}) as unknown as z.ZodString;
	});

	return schema;
};

// Definición de las fases de validación de contraseña
export const passwordFaceSchemas = [
	{
		number: 1,
		schema: createPasswordSchema({ minLength: 6 }),
		errorMessages: 'Debe tener al menos 6 caracteres'
	},
	{
		number: 2,
		errorMessages: 'Debe contener al menos un número',
		schema: createPasswordSchema({
			minLength: 6,
			regexRules: [
				{ regex: /\d/, message: 'Debe contener al menos un número' }
			]
		})
	},
	{
		number: 3,
		errorMessages: 'Debe contener un carácter especial',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: /\W/,
					message: 'Debe contener al menos un carácter especial'
				}
			]
		})
	},
	{
		number: 4,
		errorMessages: 'Debe contener al menos una letra mayúscula',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: /[A-Z]/,
					message: 'Debe contener al menos una letra mayúscula'
				}
			]
		})
	},
	{
		number: 5,
		errorMessages: 'Debe contener al menos un elemento químico',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: chemicalElementRegex,
					message: 'Debe contener al menos un elemento químico'
				}
			]
		})
	},
	{
		number: 6,
		errorMessages: 'Debe contener al menos un emoji de huevo',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: eggEmojiRegex,
					message: 'Debe contener al menos un emoji de huevo'
				}
			]
		})
	},
	{
		number: 7,
		errorMessages:
			'Debe contener al menos un emoji de huevo y un emoji de huevo junto a un foco (🥚🔦 o 🔦🥚)',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: spotlightNextToEggEmojiRegex,
					message:
						'Debe contener un emoji de huevo junto a un foco (🥚🔦 o 🔦🥚)'
				}
			]
		})
	},
	{
		number: 8,
		errorMessages: 'La suma de los numeros debe ser igual a 25',
		schema: createPasswordSchema({
			minLength: 1,
			refineRules: [
				{
					test: (value: string) => {
						// Sumar todos los dígitos encontrados
						const numbers = value.match(/\d/g) || [];
						const sum = numbers.reduce(
							(acc, digit) => acc + parseInt(digit, 10),
							0
						);
						//ejemplo de numeros que suman 25: 9, 8, 5, 3
						return sum === 25;
					},
					message: 'La suma de los dígitos debe ser 25'
				}
			]
		})
	},
	{
		number: 9,
		errorMessages: 'Debe contener al menos un número par',
		schema: createPasswordSchema({
			minLength: 1,
			refineRules: [
				{
					test: (value: string) => {
						// Verificar si hay algún número par
						const numbers = value.match(/\d/g) || [];
						return numbers.some(
							digit => parseInt(digit, 10) % 2 === 0
						);
					},
					message: 'Debe contener al menos un número par'
				}
			]
		})
	},
	{
		number: 10,
		errorMessages: 'Debe contener al menos un número impar',
		schema: createPasswordSchema({
			minLength: 1,
			refineRules: [
				{
					test: (value: string) => {
						// Verificar si hay algún número impar
						const numbers = value.match(/\d/g) || [];
						return numbers.some(
							digit => parseInt(digit, 10) % 2 !== 0
						);
					},
					message: 'Debe contener al menos un número impar'
				}
			]
		})
	},
	{
		number: 11,
		errorMessages:
			'Debe contener un emoji de tulipán junto a un emoji de tortuga',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: tulipanWitATurtle,
					message:
						'Debe contener un emoji de tulipán junto a un emoji de tortuga'
				}
			]
		})
	},
	{
		number: 12,
		errorMessages: 'Debe contener un número romano',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: numberRoman,
					message: 'Debe contener un número romano'
				}
			]
		})
	},
	{
		number: 13,
		errorMessages:
			'Debe de estar el numero romano al lado del emoji de tortuga o tulipan',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex:
						/🐢I|🐢V|🐢X|🐢L|🐢C|🐢D|🐢M|🌷I|🌷V|🌷X|🌷L|🌷C|🌷D|🌷M/,
					message:
						'Debe de estar el numero romano al lado del emoji de tortuga o tulipan'
				}
			]
		})
	},
	{
		number: 14,
		errorMessages: 'Debe contener una URL de un video de YouTube',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex:
						/https:\/\/www.youtube.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
					message: 'Debe contener una URL de un video de YouTube'
				}
			]
		})
	},
	{
		number: 15,
		errorMessages: 'Debe contener un emoji de gato',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: /🐱/,
					message: 'Debe contener un emoji de gato'
				}
			]
		})
	},
	{
		number: 16,
		errorMessages: 'Dale de comer al gato con un emoji de pescado',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: /🐱🐟|🐟🐱/,
					message: 'Dale de comer al gato con un emoji de pescado'
				}
			]
		})
	},
	{
		number: 17,
		errorMessages: 'Debe contener un RFC valido',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: /[A-Z]{4}[0-9]{6}[A-Z0-9]{3}/,
					message: 'Debe contener un RFC valido'
				}
			]
		})
	},
	{
		number: 18,
		errorMessages: 'Debe contener un emoji de corazon',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: /❤️/,
					message: 'Debe contener un emoji de corazon'
				}
			]
		})
	},
	{
		number: 19,
		errorMessages: 'Debe contener el resultado de la operacion 2+2',
		schema: createPasswordSchema({
			minLength: 1,
			refineRules: [
				{
					test: (value: string) => {
						return value.includes('4');
					},
					message: 'Debe contener el resultado de la operacion 2+2'
				}
			]
		})
	},
	{
		number: 20,
		errorMessages:
			'Debe contener un emoji de corazon y un emoji de corazon junto a un emoji de fuego (❤️🔥 o 🔥❤️) y un emoji de corazon junto a un emoji de fuego y un emoji de corazon (❤️🔥❤️)',
		schema: createPasswordSchema({
			minLength: 1,
			regexRules: [
				{
					regex: /❤️🔥❤️|❤️❤️🔥|🔥❤️❤️/,
					message:
						'Debe contener un emoji de corazon junto a un emoji de fuego y un emoji de corazon (❤️🔥❤️)'
				}
			]
		})
	}
];

export const validateFaces = ({
	actualFace,
	passwordFaceSchemas,
	actualValue
}: {
	actualFace: number;
	passwordFaceSchemas: { number: number; schema: z.ZodString }[];
	actualValue: string;
}) => {
	return passwordFaceSchemas
		.filter(({ number }) => number <= actualFace) // Solo evalúa hasta la fase actual
		.map(({ number, schema }) => ({
			number,
			isValid: schema.safeParse(actualValue).success // Valida la contraseña
		}));
};
