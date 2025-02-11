//zod clone
interface LinError {
	code: string;
	message: string;
	type: string | number | boolean | object | null | undefined;
	path: string;
}

type Result<T> =
	| { isValid: true; data: T }
	| { isValid: false; errors: LinError[] };

export class L {
	private constructor() {}

	public static String() {
		return new LString();
	}

	public static MultiParse(
		...inputs: {
			value: unknown;
			schema: LString;
			fase: string;
		}[]
	): Result<unknown> {
		const errors: LinError[] = [];

		for (const { value, schema, fase } of inputs) {
			const result = schema.parse(value);

			if (!result.isValid) {
				for (const error of result.errors) {
					errors.push({
						...error,
						path: fase // Asignamos el nombre de la fase al path del error
					});
				}
			}
		}

		return errors.length > 0
			? { isValid: false, errors }
			: { isValid: true, data: null };
	}
}

class LString {
	private _min?: number;
	private _max?: number;
	private _regex?: RegExp;
	private _refines: Array<(value: string) => boolean> = [];
	private _minMessage: string = 'Must be at least {min} characters';
	private _maxMessage: string = 'Must be at most {max} characters';
	private _regexMessage: string = 'Does not match pattern';
	private _refineMessage: string = 'Custom refinement check failed';

	min(length: number, message?: string) {
		this._min = length;
		if (message) this._minMessage = message;
		return this;
	}

	max(length: number, message?: string) {
		this._max = length;
		if (message) this._maxMessage = message;
		return this;
	}

	regex(pattern: RegExp, message?: string) {
		this._regex = pattern;
		if (message) this._regexMessage = message;
		return this;
	}

	refine(callback: (value: string) => boolean, message?: string) {
		this._refines.push(callback);
		if (message) this._refineMessage = message;
		return this;
	}

	parse(value: unknown): Result<string> {
		const errors: LinError[] = [];

		if (typeof value !== 'string') {
			errors.push({
				code: 'invalid_type',
				message: 'Expected string',
				type: 'string',
				path: ''
			});
		} else {
			if (this._min !== undefined && value.length < this._min) {
				errors.push({
					code: 'too_short',
					message: this._minMessage.replace(
						'{min}',
						String(this._min)
					),
					type: 'string',
					path: ''
				});
			}
			if (this._max !== undefined && value.length > this._max) {
				errors.push({
					code: 'too_long',
					message: this._maxMessage.replace(
						'{max}',
						String(this._max)
					),
					type: 'string',
					path: ''
				});
			}
			if (this._regex && !this._regex.test(value)) {
				errors.push({
					code: 'invalid_format',
					message: this._regexMessage,
					type: 'string',
					path: ''
				});
			}

			// Aplicar refinamientos personalizados
			for (const refine of this._refines) {
				if (!refine(value)) {
					errors.push({
						code: 'refine_failed',
						message: this._refineMessage,
						type: 'string',
						path: ''
					});
				}
			}
		}
		return errors.length > 0
			? { isValid: false, errors }
			: { isValid: true, data: value as string };
	}
}

const schema1 = L.String()
	.min(3)
	.max(10)
	.regex(/^[a-zA-Z0-9]+$/);
const schema2 = L.String()
	.min(3)
	.max(10)
	.regex(/^[a-zA-Z0-9]+$/)
	.refine(value => value === '123', 'EL VALOR NO ES 123');

const resultados = L.MultiParse(
	{ value: 'abc123', schema: schema1, fase: 'fase1' },
	{ value: '123l', schema: schema2, fase: 'fase2' }
);

console.log(resultados);
