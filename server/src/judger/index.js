import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import shelljs from 'shelljs';

import Problem from '../models/problem.js';
import checker from './checker.js';
import writeTestcase from './writeTestcase.js';
import languages from './languages.js';

import connectDb from '../config/db.js';

connectDb();

const judger = async ({ src, language, problem: problemId }) => {
	if (!problemId || !language || !src) {
		return {
			status: 'AB',
			msg: 'All fields are required',
		};
	}

	if (!Object.keys(languages).includes(language)) {
		return {
			status: 'AB',
			msg: `Language "${language}" not supported`,
		};
	}

	const problem = await Problem.findOne({ id: problemId });

	if (!problem) {
		return {
			status: 'AB',
			msg: `Problem "${problemId}" not found`,
		};
	}

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
					msg: stderr.toString(),
				};
			}

			console.log('Compile code successfull');
		}

		const res = [];
		for (let i = 1; i <= problem.testcase.length; i++) {
			const cmd = `/bin/time -q -f "%M %U" -o testcase/${i}usage.txt prlimit -m=${problem.memoryLimit}m -t=${problem.timeLimit} ${languages[language].runCmd} < testcase/${i}.inp 2> testcase/${i}.err > testcase/${i}_.out`;

			const { code: status, stderr, stdout } = shelljs.exec(cmd, { cwd, silent: false });

			let [memory, time] = fs
				.readFileSync(path.join(path.resolve(), 'tmp', 'testcase', `${i}usage.txt`))
				.toString()
				.trim()
				.split(' ')
				.map((item) => Number(item));

			memory = Number((memory / 1028).toFixed(1));

			console.log(cmd, status, stderr, stdout, memory, time);

			if (status == 0) {
				res.push({
					status: checker(
						path.join(path.resolve(), 'tmp', 'testcase', `${i}_.out`),
						path.join(path.resolve(), 'tmp', 'testcase', `${i}.out`),
					)
						? 'AC'
						: 'WA',
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
					msg:
						fs.readFileSync(path.join(path.resolve(), 'tmp', 'testcase', `${i}.err`)).toString() ||
						`Exit code ${status}`,
					time,
					memory,
				});
				//not working very well
			}
		}

		console.log(res);
	} catch (err) {
		console.error(`Error in judging code: ${err.message}`);

		return {
			status: 'IE',
			msg: err.message,
		};
	}
};

(async function () {
	const res = await judger({
		src: `
		#include <bits/stdc++.h>
		using namespace std;
		
		int main(){
		while(1)int a[100000000000];}`,
		language: 'c++17',
		problem: 'bai100',
	});
	console.log(res);
})();

export default judger;
