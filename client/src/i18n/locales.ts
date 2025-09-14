export const localesCode = ['en', 'vi', 'es', 'fr', 'de', 'ru', 'ar', 'zh', 'hi', 'ja', 'pt', 'ko', 'tr'] as const;

export type Locale = (typeof localesCode)[number];

export const locales: Record<Locale, string> = {
	en: 'English', // Toàn cầu
	vi: 'Tiếng Việt', // Đông Nam Á
	es: 'Español', // Tây Ban Nha / Mỹ Latin
	fr: 'Français', // Châu Âu / Châu Phi
	de: 'Deutsch', // Trung Âu
	ru: 'Русский', // Đông Âu / Nga
	ar: 'العربية', // Trung Đông / Bắc Phi
	zh: '中文', // Trung Quốc
	hi: 'हिन्दी', // Ấn Độ
	ja: '日本語', // Nhật Bản
	pt: 'Português', // Brazil / Bồ Đào Nha
	ko: '한국어', // Hàn Quốc
	tr: 'Türkçe', // Thổ Nhĩ Kỳ
};
