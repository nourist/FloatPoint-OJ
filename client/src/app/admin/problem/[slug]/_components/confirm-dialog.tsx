'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	isLoading?: boolean;
}

const ConfirmDialog = ({ open, onOpenChange, title, description, confirmText, cancelText, onConfirm, isLoading = false }: ConfirmDialogProps) => {
	const t = useTranslations('admin.problem.testcase');

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
						{cancelText || t('cancel')}
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
						{isLoading ? t('saving') : confirmText || t('delete')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmDialog;