'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { BasicSettings } from './_components/basic-settings';
import { NotificationSettings } from './_components/notification-settings';
import { ProfileSettings } from './_components/profile-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

const SettingsPage = () => {
	const t = useTranslations('settings');
	const [activeTab, setActiveTab] = useState('basic');

	return (
		<Tabs value={activeTab} className="space-y-6" onValueChange={setActiveTab}>
			<TabsList>
				<TabsTrigger value="basic">{t('tabs.basic')}</TabsTrigger>
				<TabsTrigger value="profile">{t('tabs.profile')}</TabsTrigger>
				<TabsTrigger value="notification">{t('tabs.notification')}</TabsTrigger>
			</TabsList>
			<TabsContent className="mt-0" value="basic">
				<BasicSettings />
			</TabsContent>
			<TabsContent className="mt-0" value="profile">
				<ProfileSettings />
			</TabsContent>
			<TabsContent className="mt-0" value="notification">
				<NotificationSettings />
			</TabsContent>
		</Tabs>
	);
};

export default SettingsPage;
