import { cn } from "~/lib/utils";

interface Props{
	className?: string;
}

const SubmissionChart = ({ className }: Props) => {
	return <div className={cn("bg-card lg:w-80 w-full rounded-2xl border p-6 shadow-xs", className)}></div>;
};

export default SubmissionChart;
