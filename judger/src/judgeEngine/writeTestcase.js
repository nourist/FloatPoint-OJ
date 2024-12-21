import path from 'path';
import fs from 'fs-extra';

const writeTestcase = (testcase = []) => {
	fs.emptyDirSync(path.join(path.resolve(), 'tmp', 'testcase'));

	testcase.forEach((test, index) => {
		fs.writeFileSync(path.join(path.resolve(), 'tmp', 'testcase', `${index + 1}.inp`), test.stdin);
		fs.writeFileSync(path.join(path.resolve(), 'tmp', 'testcase', `${index + 1}.out`), test.stdout);
	});
};

export default writeTestcase;
