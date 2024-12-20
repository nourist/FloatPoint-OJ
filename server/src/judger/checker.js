import fs from 'fs';

const checker = (file1, file2) => {
	if (!file1 || !file2) {
		throw new Error('All file path are required');
	}

	if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
		throw new Error('File not found');
	}

	const str1 = fs.readFileSync(file1).toString();
	const str2 = fs.readFileSync(file2).toString();

	let lines1 = str1.split('\n');
	let lines2 = str2.split('\n');

	lines1 = lines1.map((line) => line.trim());
	lines2 = lines2.map((line) => line.trim());

	while (lines1.length != 0 && lines1[0].length == 0) {
		lines1 = lines1.slice(1);
	}

	while (lines2.length != 0 && lines2[0].length == 0) {
		lines2 = lines2.slice(1);
	}

	while (lines1.length != 0 && lines1[lines1.length - 1].length == 0) {
		lines1 = lines1.slice(0, -1);
	}

	while (lines2.length != 0 && lines2[lines2.length - 1].length == 0) {
		lines2 = lines2.slice(0, -1);
	}

	if (lines1.length != lines2.length) {
		return false;
	}

	return lines1.every((line1, index) => line1 == lines2[index]);
};

export default checker;
