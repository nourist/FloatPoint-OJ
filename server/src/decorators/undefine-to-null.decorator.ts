import { Transform } from 'class-transformer';

export const UndefinedToNull = () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Transform(({ value }) => (value === undefined ? null : value));
};
