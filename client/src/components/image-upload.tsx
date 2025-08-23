'use client';

import { ImagePlus, Trash2, Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useImageUpload } from '~/hooks/use-image-upload';
import { cn } from '~/lib/utils';

export type ImageUploadRef = {
	setPreviewUrl: Dispatch<SetStateAction<string | null>>;
	getFile: () => File | null; // cho phép parent lấy file
	clear: () => void; // cho phép parent xoá file
	getIsEdited: () => boolean;
};

type Props = {
	title?: string;
};

export const ImageUpload = forwardRef<ImageUploadRef, Props>(({ title }, ref) => {
	const t = useTranslations('upload');

	const { previewUrl, fileName, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove, setPreviewUrl, isEdited } = useImageUpload({
		onUpload: console.log,
	});

	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const file = e.dataTransfer.files?.[0];
			if (file && file.type.startsWith('image/')) {
				const fakeEvent = {
					target: {
						files: [file],
					},
				} as unknown as React.ChangeEvent<HTMLInputElement>;
				handleFileChange(fakeEvent);
			}
		},
		[handleFileChange],
	);

	// expose ra ngoài
	useImperativeHandle(ref, () => ({
		getFile: () => fileInputRef.current?.files?.[0] ?? null,
		clear: () => handleRemove(),
		setPreviewUrl,
		getIsEdited: () => isEdited,
	}));

	return (
		<div className="bg-card w-full max-w-md space-y-6 rounded-xl border p-6 shadow-xs">
			<div className="space-y-2">
				<h3 className="text-lg font-medium">{title ?? t('title')}</h3>
				<p className="text-muted-foreground text-sm">{t('supported_formats')}</p>
			</div>

			<Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

			{!previewUrl ? (
				<div
					onClick={handleThumbnailClick}
					onDragOver={handleDragOver}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={cn(
						'border-muted-foreground/25 bg-muted/50 hover:bg-muted flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed transition-colors',
						isDragging && 'border-primary/50 bg-primary/5',
					)}
				>
					<div className="bg-background rounded-full p-3 shadow-sm">
						<ImagePlus className="text-muted-foreground h-6 w-6" />
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">{t('click_to_select')}</p>
						<p className="text-muted-foreground text-xs">{t('or_drag_and_drop_file_here')}</p>
					</div>
				</div>
			) : (
				<div className="relative">
					<div className="group relative h-64 overflow-hidden rounded-lg border">
						<Image
							src={previewUrl}
							alt="Preview"
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
						<div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
						<div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
							<Button size="sm" variant="secondary" onClick={handleThumbnailClick} className="h-9 w-9 p-0">
								<Upload className="h-4 w-4" />
							</Button>
							<Button size="sm" variant="destructive" onClick={handleRemove} className="h-9 w-9 p-0">
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
					{fileName && (
						<div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
							<span className="truncate">{fileName}</span>
							<button onClick={handleRemove} className="hover:bg-muted ml-auto rounded-full p-1">
								<X className="h-4 w-4" />
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
});

ImageUpload.displayName = 'ImageUpload';
