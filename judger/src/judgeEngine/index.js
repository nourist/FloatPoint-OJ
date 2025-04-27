import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import shelljs from 'shelljs';

import checker from './checker.js';
import writeTestcase from './writeTestcase.js';
import languages from './languages.js';
import getFinalResult from './getFinalResult.js';

const judger = async ({ src, language, problem }) => {
	if (!problem || !language || !src) {
		throw new Error('All fields are required');
	}

	if (!Object.keys(languages).includes(language)) {
		throw new Error(`Language "${language}" not supported`);
	}

	const finalMsg = { compiler: '', checker: '' };

	console.log('Starting judge...');
	try {
		const cwd = path.join(path.resolve(), 'tmp');

		fs.writeFileSync(path.join(path.resolve(), 'tmp', languages[language].mainFile), src);
		console.log('Write source code successfull');

		writeTestcase(problem.testcase);
		console.log('Write testcase successfull');

		if (languages[language].compileCmd) {
			const commands = languages[language].compileCmd.split(' ');
			const { stderr, status } = spawnSync(commands[0], commands.slice(1), { cwd });

			if (status != 0) {
				console.error('Error in compile code');

				return {
					status: 'CE',
					msg: { compiler: stderr.toString() },
				};
			}

			console.log('Compile code successfull');
			finalMsg.compiler = 'Compile code successfull';
		}

		const res = [];
		for (let i = 1; i <= problem.testcase.length; i++) {
			const cmd = `/bin/time -q -f "%M %U" -o testcase/${i}usage.txt prlimit -m=${problem.memoryLimit}m -t=${problem.timeLimit} ${languages[language].runCmd} < testcase/${i}.inp 2> testcase/${i}.err > testcase/${i}_.out`;

			console.log(`Running on test ${i}...`);
			finalMsg.checker += `Running on test ${i}...\n`;
			const { code: status, stderr, stdout } = shelljs.exec(cmd, { cwd, silent: false });

			let [memory, time] = fs
				.readFileSync(path.join(path.resolve(), 'tmp', 'testcase', `${i}usage.txt`))
				.toString()
				.trim()
				.split(' ')
				.map((item) => Number(item));

			memory = Number((memory / 1024).toFixed(1));

			if (status == 0) {
				res.push({
					status: checker(path.join(path.resolve(), 'tmp', 'testcase', `${i}_.out`), path.join(path.resolve(), 'tmp', 'testcase', `${i}.out`)) ? 'AC' : 'WA',
					time,
					memory,
				});
			} else if (status == 137) {
				if (memory >= problem.memoryLimit) {
					res.push({
						status: 'MLE',
						time,
					});
				} else {
					res.push({
						status: 'TLE',
						memory,
					});
				}
			} else {
				res.push({
					status: 'RTE',
					msg: { checker: fs.readFileSync(path.join(path.resolve(), 'tmp', 'testcase', `${i}.err`)).toString() || `Exit code ${status}` },
					time,
					memory,
				});
				//not working very well
			}
		}

		console.log(`Judging code successfull`);
		finalMsg.checker += `Judging code successfull\n`;

		return {
			...getFinalResult(res, { maxPoint: problem.point }),
			testcase: res,
			msg: finalMsg,
		};
	} catch (err) {
		console.error(`Error in judging code: ${err.message}`);

		return {
			status: 'IE',
			msg: { server: err.message },
		};
	}
};

export default judger;
