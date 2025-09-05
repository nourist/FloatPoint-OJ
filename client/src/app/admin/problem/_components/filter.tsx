'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { FilterRangeSlider, FilterSwitch, FilterTags } from '~/components/filter-panel';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select';
import { getDifficultyBgColor } from '~/lib/difficulty-utils';
import { Difficulty } from '~/types/problem.type';

interface Props {
	minPoint: number;
	maxPoint: number;
	tags: string[];
	setTags: (tags: string[]) => void;
	tagOptions: string[];
	difficulty: string;
	setDifficulty: (difficulty: string) => void;
	hasEditorial: boolean;
	setHasEditorial: (hasEditorial: boolean) => void;
	pointRange: [number, number];
	setPointRange: (pointRange: [number, number]) => void;
}

const Filter = ({ minPoint, maxPoint, tags, setTags, tagOptions, difficulty, setDifficulty, hasEditorial, setHasEditorial, pointRange, setPointRange }: Props) => {
	const t = useTranslations('admin.problem.filter');

	const difficultyOptions = [
		{ value: 'all', label: t('all') },
		{ value: 'easy', label: t('easy') },
		{ value: 'medium', label: t('medium') },
		{ value: 'hard', label: t('hard') },
	];

	return (
		<div className="flex w-full flex-wrap gap-2">
			<Select value={difficulty} onValueChange={setDifficulty}>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{t('difficulty')}</SelectLabel>
						{difficultyOptions.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								<div className={`h-[18px] w-[18px] rounded-md border border-solid ${getDifficultyBgColor(item.value as Difficulty)}`}></div>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" className={hasEditorial ? 'text-primary' : ''}>
						{t('editorial')}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="px-1">
					<FilterSwitch value={hasEditorial} setValue={setHasEditorial} label={t('has_editorial')} />
				</PopoverContent>
			</Popover>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline">
						{t('point_range')} {pointRange[0]} - {pointRange[1]}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="space-y-0.5 px-1">
					<FilterRangeSlider min={minPoint} max={maxPoint} value={pointRange} setValue={setPointRange} />
				</PopoverContent>
			</Popover>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" className={tags.length > 0 ? 'text-primary' : ''}>
						{t('tags')}
						{tags.length > 0 && <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1">{tags.length}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="space-y-0.5 px-1">
					<FilterTags tags={tagOptions} value={tags} setValue={setTags} />
				</PopoverContent>
			</Popover>
			<Button className="ml-auto" asChild>
				<Link href="/admin/problem/create">
					<Plus />
					{t('new')}
				</Link>
			</Button>
		</div>
	);
};

export default Filter;
