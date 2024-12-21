const getFinalResult = (testResult = [], { maxPoint }) => {
	const status =
		(testResult.some((test) => test.status == 'WA') && 'WA') ||
		(testResult.some((test) => test.status == 'RTE') && 'RTE') ||
		(testResult.some((test) => test.status == 'TLE') && 'TLE') ||
		(testResult.some((test) => test.status == 'MLE') && 'MLE') ||
		'AC';
	const time = testResult.some((test) => test.status == 'TLE')
		? -1
		: testResult.reduce((acc, test) => acc + test.time, 0);
	const memory = testResult.some((test) => test.status == 'MLE')
		? -1
		: testResult.reduce((acc, test) => Math.max(acc, test.memory), 0);
	const noOfAC = testResult.reduce((acc, test) => acc + (test.status == 'AC'), 0);
	const point = (maxPoint / testResult.length) * noOfAC;

	return { status, time, memory, point: Number(point.toFixed(2)) };
};

export default getFinalResult;
