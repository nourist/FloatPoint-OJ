'use client';

import { useTranslations } from 'next-intl';

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

interface TabNavigationProps {
	activeTab: 'info' | 'editorial' | 'testcase';
	onTabChange: (tab: 'info' | 'editorial' | 'testcase') => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
	const t = useTranslations('admin.problem.tabs');

	return (
		<Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'info' | 'editorial' | 'testcase')}>
			<TabsList>
				<TabsTrigger value="info">{t('info')}</TabsTrigger>
				<TabsTrigger value="editorial">{t('editorial')}</TabsTrigger>
				<TabsTrigger value="testcase">{t('testcase')}</TabsTrigger>
			</TabsList>
		</Tabs>
	);
};

export default TabNavigation;
