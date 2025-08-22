import Image from 'next/image';
import Link from 'next/link';

import RichTextRenderer from '~/components/rich-text-renderer';
import UserAvatar from '~/components/user-avatar';
import { joinUrl } from '~/lib/utils';
import { Blog } from '~/types/blog.type';

interface Props {
	data: Blog;
}

const BlogCard = ({ data }: Props) => {
	return (
		<div className="bg-card rounded-2xl border p-6 shadow-xs">
			<Link href={`/profile/${data.author.username}`} className="group mb-4 flex items-center gap-2">
				<UserAvatar user={data.author} className="size-10" />
				<div className="space-y-0.5">
					<p className="font-medium group-hover:underline">{data.author.username}</p>
					<p className="text-muted-foreground text-xs">{data.createdAt.toLocaleDateString()}</p>
				</div>
			</Link>
			<Link href={`/blog/${data.slug}`} className="hover:text-primary text-2xl font-semibold hover:underline">
				{data.title}
			</Link>
			{data.thumbnailUrl && (
				<div className="bg-accent relative mt-4 h-120 w-full rounded-xl">
					<Image src={'/' + joinUrl('storage', data.thumbnailUrl)} alt={data.title} fill className="object-contain" />
				</div>
			)}
			<RichTextRenderer className="mt-4" content={JSON.parse(data.content)} />
		</div>
	);
};

export default BlogCard;
