import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			className="toaster group"
			style={
				{
					'--normal-bg': 'var(--popover)',
					'--normal-text': 'var(--popover-foreground)',
					'--normal-border': 'var(--border)',
				} as React.CSSProperties
			}
			toastOptions={{
				closeButton: true,
				classNames: {
					success: '!text-success',
					error: '!text-destructive',
					warning: '!text-warning',
					info: '!text-info',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
