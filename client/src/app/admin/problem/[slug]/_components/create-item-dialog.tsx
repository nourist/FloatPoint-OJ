'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';

interface CreateItemDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	itemType: 'subtask' | 'testcase';
	onCreate: (name: string) => Promise<void>;
	isLoading?: boolean;
}

const CreateItemDialog = ({ open, onOpenChange, itemType, onCreate, isLoading = false }: CreateItemDialogProps) => {
	const t = useTranslations('admin.problem.testcase');
	const [name, setName] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			await onCreate(name.trim());
			setName('');
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{itemType === 'subtask' ? t('create_subtask_title') : t('create_testcase_title')}</DialogTitle>
					<DialogDescription>{itemType === 'subtask' ? t('create_subtask_description') : t('create_testcase_description')}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="name" className="text-right">
								{t('name')}
							</label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="col-span-3"
								placeholder={itemType === 'subtask' ? t('subtask_name_placeholder') : t('testcase_name_placeholder')}
								disabled={isLoading}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
							{t('cancel')}
						</Button>
						<Button type="submit" disabled={isLoading || !name.trim()}>
							{isLoading ? t('creating') : t('create')}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateItemDialog;
