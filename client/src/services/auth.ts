import http from '~/lib/http';

export const getMe = () => http.get('/auth');
