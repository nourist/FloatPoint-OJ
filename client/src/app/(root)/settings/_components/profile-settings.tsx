'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { z } from 'zod';
import { useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';
import { Camera } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useImageUpload } from '~/hooks/use-image-upload';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { userServiceInstance } from '~/services/user';
import UserAvatar from '~/components/user-avatar';

const profileFormSchema = z.object({
  username: z.string().min(3).max(20),
  fullname: z.string().max(50).optional(),
  bio: z.string().max(200).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const ProfileSettings = () => {
  const t = useTranslations('settings.profile');
  const { getProfile } = createClientService(authServiceInstance);
  const { updateProfile, updateAvatar } = createClientService(userServiceInstance);
  const { data: user, mutate } = useSWR('/auth/me', getProfile);

  const {
    previewUrl,
    fileInputRef,
    handleFileChange,
    handleThumbnailClick,
    setPreviewUrl,
    isEdited,
  } = useImageUpload();

  useEffect(() => {
    if (user?.avatarUrl) {
      // Use the avatar URL directly without any processing
      setPreviewUrl(user.avatarUrl);
    }
    return () => {};
  }, [user?.avatarUrl, setPreviewUrl]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      fullname: '',
      bio: '',
    }
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || '',
        fullname: user.fullname || '',
        bio: user.bio || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile(values);
      if (isEdited && fileInputRef.current?.files?.[0]) {
        await updateAvatar(fileInputRef.current.files[0]);
      }
      mutate(); // Revalidate user data
      toast.success(t('form.update_success'));
    } catch (error) {
      toast.error(t('form.update_error'));
      console.error('Profile update error:', error);
    }
  };

  // Check if the preview URL is an SVG
  const isSvgPreview = previewUrl?.endsWith('.svg') || false;

  return (
    <div className="bg-card space-y-8 rounded-2xl border p-6 shadow-xs">
      <div>
        <h3 className="text-lg font-medium">{t('title')}</h3>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile header with avatar on left and user info on right */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative group">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div className="relative">
                {previewUrl ? (
                  isSvgPreview ? (
                    // For SVG previews, use img tag directly
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Avatar Preview" className="size-32 rounded-full object-cover" />
                  ) : (
                    // For other image types, use Next.js Image component
                    <Image src={previewUrl} alt="Avatar Preview" width={128} height={128} className="size-32 rounded-full object-cover" />
                  )
                ) : (
                  user && <UserAvatar user={user} className="size-32" />
                )}
                {/* Overlay with camera icon on hover */}
                <div 
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleThumbnailClick}
                >
                  <Camera className="text-white size-8" />
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.username')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.fullname')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.bio')}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[120px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t('form.saving') : t('form.save')}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/forgot-password">{t('form.reset_password')}</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};