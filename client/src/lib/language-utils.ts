import { ProgramLanguage } from '~/types/submission.type';

export interface LanguageOption {
	value: ProgramLanguage;
	label: string;
}

export const languageOptions: LanguageOption[] = [
	// C Languages
	{ value: ProgramLanguage.C99, label: 'C 99' },
	{ value: ProgramLanguage.C11, label: 'C 11' },
	{ value: ProgramLanguage.C17, label: 'C 17' },
	{ value: ProgramLanguage.C23, label: 'C 23' },
	// C++ Languages
	{ value: ProgramLanguage.CPP03, label: 'C++ 03' },
	{ value: ProgramLanguage.CPP11, label: 'C++ 11' },
	{ value: ProgramLanguage.CPP14, label: 'C++ 14' },
	{ value: ProgramLanguage.CPP17, label: 'C++ 17' },
	{ value: ProgramLanguage.CPP20, label: 'C++ 20' },
	{ value: ProgramLanguage.CPP23, label: 'C++ 23' },
	// Java Languages
	{ value: ProgramLanguage.JAVA_8, label: 'Java 8' },
	{ value: ProgramLanguage.JAVA_11, label: 'Java 11' },
	{ value: ProgramLanguage.JAVA_17, label: 'Java 17' },
	// Python Languages
	{ value: ProgramLanguage.PYTHON2, label: 'Python 2' },
	{ value: ProgramLanguage.PYTHON3, label: 'Python 3' },
];

export const getLanguageColor = (language: ProgramLanguage): string => {
	const baseColors: Record<string, string> = {
		c: '#5C9CC7',
		cpp: '#00599C',
		java: '#ED8B00',
		python: '#3776AB',
	};

	const languageMap: Record<ProgramLanguage, { base: string; shade: number }> = {
		// C Languages
		[ProgramLanguage.C99]: { base: 'c', shade: 0.8 },
		[ProgramLanguage.C11]: { base: 'c', shade: 1.0 },
		[ProgramLanguage.C17]: { base: 'c', shade: 1.2 },
		[ProgramLanguage.C23]: { base: 'c', shade: 1.4 },

		// C++ Languages
		[ProgramLanguage.CPP03]: { base: 'cpp', shade: 0.8 },
		[ProgramLanguage.CPP11]: { base: 'cpp', shade: 1.0 },
		[ProgramLanguage.CPP14]: { base: 'cpp', shade: 1.2 },
		[ProgramLanguage.CPP17]: { base: 'cpp', shade: 1.4 },
		[ProgramLanguage.CPP20]: { base: 'cpp', shade: 1.6 },
		[ProgramLanguage.CPP23]: { base: 'cpp', shade: 1.8 },

		// Java Languages
		[ProgramLanguage.JAVA_8]: { base: 'java', shade: 0.8 },
		[ProgramLanguage.JAVA_11]: { base: 'java', shade: 1.0 },
		[ProgramLanguage.JAVA_17]: { base: 'java', shade: 1.2 },

		// Python Languages
		[ProgramLanguage.PYTHON2]: { base: 'python', shade: 0.8 },
		[ProgramLanguage.PYTHON3]: { base: 'python', shade: 1.0 },
	};

	const { base, shade } = languageMap[language];
	const baseColor = baseColors[base];

	// Convert hex to RGB
	const r = parseInt(baseColor.slice(1, 3), 16);
	const g = parseInt(baseColor.slice(3, 5), 16);
	const b = parseInt(baseColor.slice(5, 7), 16);

	// Apply shade (darker for < 1.0, lighter for > 1.0)
	const adjust = (color: number) => {
		if (shade < 1.0) {
			return Math.floor(color * shade);
		} else {
			return Math.floor(color + ((255 - color) * (shade - 1.0)) / 2);
		}
	};

	// Convert back to hex
	const toHex = (c: number) => c.toString(16).padStart(2, '0');

	return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
};
