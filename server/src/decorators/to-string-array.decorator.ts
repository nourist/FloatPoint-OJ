import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export function ToStringArray(options?: { optional?: boolean }) {
	const decorators = [
		Type(() => String),
		Transform(({ value }) => {
			if (value === undefined || value === null) return undefined;
			if (Array.isArray(value)) return value.map(String);
			return [String(value)];
		}),

		IsArray(),
		IsString({ each: true }),
	];

	if (options?.optional) {
		decorators.push(IsOptional());
	}

	return applyDecorators(...decorators);
}
