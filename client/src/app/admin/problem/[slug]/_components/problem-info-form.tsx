'use client';

import ProblemForm from '~/components/problem-form';
import { Problem } from '~/types/problem.type';

interface Props {
	tagOptions: string[];
	problem: Problem;
	onUpdate?: (updatedProblem: Problem) => void;
}

const ProblemInfoForm = ({ tagOptions, problem, onUpdate }: Props) => {
	return <ProblemForm tagOptions={tagOptions} problem={problem} onSubmitSuccess={onUpdate} mode="edit" />;
};

export default ProblemInfoForm;
