const languages = {
	c: {
		mainFile: 'main.c',
		compileCmd: 'gcc -std=c99 main.c -o main',
		runCmd: './main',
	},
	c11: {
		mainFile: 'main.c',
		compileCmd: 'gcc -std=c11 main.c -o main',
		runCmd: './main',
	},
	'c++11': {
		mainFile: 'main.cpp',
		compileCmd: 'g++ -std=c++11 main.cpp -o main',
		runCmd: './main',
	},
	'c++14': {
		mainFile: 'main.cpp',
		compileCmd: 'g++ -std=c++14 main.cpp -o main',
		runCmd: './main',
	},
	'c++17': {
		mainFile: 'main.cpp',
		compileCmd: 'g++ -std=c++17 main.cpp -o main',
		runCmd: './main',
	},
	'c++20': {
		mainFile: 'main.cpp',
		compileCmd: 'g++ -std=c++20 main.cpp -o main',
		runCmd: './main',
	},
	python2: {
		mainFile: 'main.py',
		runCmd: 'python2 main.py',
	},
	python3: {
		mainFile: 'main.py',
		runCmd: 'python3 main.py',
	},
};

export default languages;
