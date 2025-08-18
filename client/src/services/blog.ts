import { Blog, BlogComment } from '../types/blog.type';
import { ApiInstance } from '~/types/axios.type';

// Payloads
export interface CreateBlogPayload {
	title: string;
	content: string;
	thumbnail?: File;
}

export interface UpdateBlogPayload {
	title?: string;
	content?: string;
	thumbnail?: File;
}

export interface CreateBlogCommentPayload {
	content: string;
}

export interface UpdateBlogCommentPayload {
	content?: string;
}

// Responses
export interface BlogResponse {
	message: string;
	blog: Blog;
}

export interface BlogsResponse {
	message: string;
	blogs: Blog[];
}

export interface BlogCommentResponse {
	message: string;
	comment: BlogComment;
}

export interface BlogCommentsResponse {
	message: string;
	comments: BlogComment[];
}

export interface SimpleMessageResponse {
	message: string;
}

// Functions
export const createBlogService = (http: ApiInstance) => ({
	createBlog: (payload: CreateBlogPayload) => {
		const formData = new FormData();
		formData.append('title', payload.title);
		formData.append('content', payload.content);
		if (payload.thumbnail) {
			formData.append('thumbnail', payload.thumbnail);
		}
		return http.post<BlogResponse>('/blog', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},

	getAllBlogs: () => {
		return http.get<BlogsResponse>('/blog');
	},

	getBlogBySlug: (slug: string) => {
		return http.get<BlogResponse>(`/blog/${slug}`);
	},

	updateBlog: (id: string, payload: UpdateBlogPayload) => {
		const formData = new FormData();
		if (payload.title) {
			formData.append('title', payload.title);
		}
		if (payload.content) {
			formData.append('content', payload.content);
		}
		if (payload.thumbnail) {
			formData.append('thumbnail', payload.thumbnail);
		}
		return http.patch<BlogResponse>(`/blog/${id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},

	deleteBlog: (id: string) => {
		return http.delete<SimpleMessageResponse>(`/blog/${id}`);
	},

	createComment: (blogId: string, payload: CreateBlogCommentPayload) => {
		return http.post<BlogCommentResponse>(`/blog/${blogId}/comments`, payload);
	},

	getCommentsByBlogId: (blogId: string) => {
		return http.get<BlogCommentsResponse>(`/blog/${blogId}/comments`);
	},

	updateComment: (blogId: string, commentId: string, payload: UpdateBlogCommentPayload) => {
		return http.patch<BlogCommentResponse>(`/blog/${blogId}/comments/${commentId}`, payload);
	},

	deleteComment: (blogId: string, commentId: string) => {
		return http.delete<SimpleMessageResponse>(`/blog/${blogId}/comments/${commentId}`);
	},
});
