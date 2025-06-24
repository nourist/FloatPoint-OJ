import ContestSetting from '~/components/ContestSetting';
import { createContest } from '~/services/contest';

const CreateContest = () => {
	return (
		<>
			<ContestSetting handler={createContest} />
		</>
	);
};

export default CreateContest;
