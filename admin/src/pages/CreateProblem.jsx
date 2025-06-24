import ProblemSetting from '~/components/ProblemSetting';
import { createProblem } from '~/services/problem';

const CreateProblem = () => {
	return <ProblemSetting handler={createProblem} />;
};

export default CreateProblem;
