import http from '../lib/http';
import { Blog, BlogComment } from '../types/blog.type';

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
export const createBlog = (payload: CreateBlogPayload) => {
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
};

export const getAllBlogs = () => {
	return http.get<BlogsResponse>('/blog');
};

export const getBlogBySlug = (slug: string) => {
	return http.get<BlogResponse>(`/blog/${slug}`);
};

export const updateBlog = (id: string, payload: UpdateBlogPayload) => {
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
};

export const deleteBlog = (id: string) => {
	return http.delete<SimpleMessageResponse>(`/blog/${id}`);
};

export const createComment = (blogId: string, payload: CreateBlogCommentPayload) => {
	return http.post<BlogCommentResponse>(`/blog/${blogId}/comments`, payload);
};

export const getCommentsByBlogId = (blogId: string) => {
	return http.get<BlogCommentsResponse>(`/blog/${blogId}/comments`);
};

export const updateComment = (blogId: string, commentId: string, payload: UpdateBlogCommentPayload) => {
	return http.patch<BlogCommentResponse>(`/blog/${blogId}/comments/${commentId}`, payload);
};

export const deleteComment = (blogId: string, commentId: string) => {
	return http.delete<SimpleMessageResponse>(`/blog/${blogId}/comments/${commentId}`);
};
