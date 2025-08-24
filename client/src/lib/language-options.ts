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
