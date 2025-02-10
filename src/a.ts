import { z, ZodString } from 'zod'

// Definimos el tipo para cada regla de validación
type RegexRule = {
  regex: RegExp;
  message?: string;
};

type RefineRule = {
  test: (value: string) => boolean;
  message?: string;
};

interface PasswordRules {
  minLength?: number;
  regexRules?: RegexRule[];
  refineRules?: RefineRule[];
}

// Función que export construye el esquema a partir de las reglas proporcionadas
export const createPasswordSchema = (rules: PasswordRules = {}): ZodString => {
  let schema = z.string();

  // Agregamos la validación de longitud mínima
  if (rules.minLength) {
    schema = schema.min(rules.minLength, {
      message: `La contraseña debe tener al menos ${rules.minLength} caracteres`,
    });
  }

  // Agregamos cada regla de expresión regular
  rules.regexRules?.forEach(rule => {
    schema = schema.regex(rule.regex, { message: rule.message });
  });

  // Agregamos cada validación personalizada (refine)
  rules.refineRules?.forEach(rule => {
    schema = schema.refine(rule.test, { message: rule.message }) as unknown as ZodString;
  });

  return schema;
};

export const passwordPhase1 = createPasswordSchema({ minLength: 6 });
export const passwordPhase2 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' }
  ]
});
export const passwordPhase3 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' }
  ]
});
export const passwordPhase4 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' }
  ]
});

// Se define la expresión regular para un elemento químico.
// (La siguiente regex es un ejemplo; asegúrate de ajustarla según tus necesidades)
export const chemicalElementRegex = /H|He|Li|Be|B|C|N|O|F|Ne|Na|Mg|Al|Si|P|S|Cl|Ar|K|Ca|Sc|Ti|V|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Y|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|I|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|W|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|U|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Nh|Fl|Mc|Lv|Ts|Og/;

export const passwordPhase5 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
    { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' }
  ]
});
export const passwordPhase6 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
    { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' }
  ],
  refineRules: [
    {
      test: (value) => {
        // Se extraen todos los dígitos y se suman
        export const numbers = value.match(/\d/g) || [];
        export const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 100;
      },
      message: 'La suma de los dígitos debe ser 100'
    }
  ]
});

export const passwordPhase7 = createPasswordSchema({
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
      test: (value) => {
        // Se extraen todos los dígitos y se suman
        export const numbers = value.match(/\d/g) || [];
        export const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 100;
      },
      message: 'La suma de los dígitos debe ser 100'
    }
  ],
  
});

// face 8 next to the egg emoji, the password must have a spotlight emoji
export const spotlightNextToEggEmojiRegex = /🥚🔦|🔦🥚/
export const passwordPhase8 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
    { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' },
    { regex: eggEmojiRegex, message: 'Debe contener al menos un emoji de huevo' },
    { regex: spotlightNextToEggEmojiRegex, message: 'Debe contener un emoji de huevo y un emoji de foco juntos' }
  ],
  refineRules: [
    {
      test: (value) => {
        // Se extraen todos los dígitos y se suman
        export const numbers = value.match(/\d/g) || [];
        export const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 100;
      },
      message: 'La suma de los dígitos debe ser 100'
    }
  ],
});

// face 9 the password must have the name of one pokemon legendaries of the third generation (First letter in uppercase)
export const legendaryPokemonRegex = /Regice|Registeel|Regirock|Latias|Latios|Kyogre|Groudon|Rayquaza|Jirachi|Deoxys/
export const passwordPhase9 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
    { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' },
    { regex: eggEmojiRegex, message: 'Debe contener al menos un emoji de huevo' },
    { regex: spotlightNextToEggEmojiRegex, message: 'Debe contener un emoji de huevo y un emoji de foco juntos' },
    { regex: legendaryPokemonRegex, message: 'Debe contener el nombre de un pokemon legendario de la tercera generación (Primera letra en mayúscula)' }
  ],
  refineRules: [
    {
      test: (value) => {
        // Se extraen todos los dígitos y se suman
        export const numbers = value.match(/\d/g) || [];
        export const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 100;
      },
      message: 'La suma de los dígitos debe ser 100'
    }
  ],
});

// face 10 the password must have a multiply whose result in 35 with Japanese numbers
export const japaneseNumberRegex = /一|二|三|四|五|六|七|八|九|十/
export const multiplyWith35Regex = /三五|五三/

export const passwordPhase10 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
    { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' },
    { regex: eggEmojiRegex, message: 'Debe contener al menos un emoji de huevo' },
    { regex: spotlightNextToEggEmojiRegex, message: 'Debe contener un emoji de huevo y un emoji de foco juntos' },
    { regex: legendaryPokemonRegex, message: 'Debe contener el nombre de un pokemon legendario de la tercera generación (Primera letra en mayúscula)' },
    { regex: japaneseNumberRegex, message: 'Debe contener un número en japonés' },
    { regex: multiplyWith35Regex, message: 'Debe contener una multiplicación cuyo resultado sea 35' }
  ],
  refineRules: [
    {
      test: (value) => {
        // Se extraen todos los dígitos y se suman
        export const numbers = value.match(/\d/g) || [];
        export const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 100;
      },
      message: 'La suma de los dígitos debe ser 100'
    }
  ],
});
export const passwordPhase11 = createPasswordSchema({
  minLength: 6,
  regexRules: [
    { regex: /\d/, message: 'Debe contener al menos un número' },
    { regex: /\W/, message: 'Debe contener al menos un carácter especial' },
    { regex: /[A-Z]/, message: 'Debe contener al menos una letra mayúscula' },
    { regex: chemicalElementRegex, message: 'Debe contener al menos un elemento químico' },
    { regex: eggEmojiRegex, message: 'Debe contener al menos un emoji de huevo' },
    { regex: spotlightNextToEggEmojiRegex, message: 'Debe contener un emoji de huevo y un emoji de foco juntos' },
    { regex: legendaryPokemonRegex, message: 'Debe contener el nombre de un pokemon legendario de la tercera generación (Primera letra en mayúscula)' },
    { regex: japaneseNumberRegex, message: 'Debe contener un número en japonés' },
    { regex: multiplyWith35Regex, message: 'Debe contener una multiplicación cuyo resultado sea 35' }
  ],
  refineRules: [
    {
      test: (value) => {
        // Se extraen todos los dígitos y se suman
        export const numbers = value.match(/\d/g) || [];
        export const sum = numbers.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum === 100;
      },
      message: 'La suma de los dígitos debe ser 100'
    }
  ],
});

// face 12 now the egg was born 