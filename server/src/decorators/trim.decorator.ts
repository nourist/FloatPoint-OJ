import { Transform } from 'class-transformer';

export function Trim() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
}
