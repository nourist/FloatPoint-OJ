import { Transform } from 'class-transformer';

export const DefaultEmptyArray = () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Transform(({ value }) => value ?? []);
};
