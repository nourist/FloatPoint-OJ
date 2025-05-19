const theme = {
	drawer: {
		styles: {
			base: {
				overlay: {
					backgroundColor: '#fff',
					position: 'fixed',
				},
			},
		},
	},
	iconButton: {
		styles: {
			base: {
				color: '!text-base-content',
			},
		},
	},
	menu: {
		styles: {
			base: {
				menu: {
					bg: 'bg-base-100',
					border: 'border border-base-300',
				},
				item: {
					initial: {
						bg: 'hover:bg-base-300',
						color: 'dark:text-blue-gray-300 hover:!text-base-content',
					},
				},
			},
		},
	},
	input: {
		styles: {
			base: {
				input: {
					placeholder: 'placeholder-base-content/60',
					color: 'text-base-content',
				},
			},
			variants: {
				outlined: {
					base: {
						input: {
							borderColor: '!border-blue-gray-200 dark:!border-blue-gray-700',
						},
					},
				},
			},
		},
	},
	checkbox: {
		styles: {
			base: {
				input: {
					borderColor: 'border-blue-gray-200 dark:border-blue-gray-700',
				},
			},
		},
	},
};

export default theme;
