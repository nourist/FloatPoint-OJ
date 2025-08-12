import { Expose, Transform, TransformFnParams } from 'class-transformer';

export function Default<T>(defaultValue: T): PropertyDecorator {
	return (target: object, propertyKey: string | symbol) => {
		Expose()(target, propertyKey);
		Transform(({ value }: TransformFnParams): T => {
			return value ?? defaultValue;
		})(target, propertyKey);
	};
}
