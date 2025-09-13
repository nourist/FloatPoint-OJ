import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export function ToBoolean() {
	const decorators = [
		Type(() => String),
		Transform(({ value }: { value: string }) => {
			if (value === 'true') return true;
			if (value === 'false') return false;
			return value;
		}),
		IsBoolean(),
	];

	return applyDecorators(...decorators);
}
