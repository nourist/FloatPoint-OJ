const theme = {
	drawer: {
		styles: {
			base: {
				overlay: {
					backgroundColor: '',
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
							borderColor:
								'dark:focus:!border-blue-gray-200 dark:border-blue-gray-800 dark:!border-t-blue-gray-800 !border-t-blue-gray-200 data-[label=true]:dark:focus:!border-t-transparent data-[label=true]:focus:!border-t-transparent',
						},
						label: {
							borderColor:
								'dark:peer-focus:before:!border-blue-gray-200 dark:peer-focus:after:!border-blue-gray-200 dark:before:border-blue-gray-800 dark:after:border-blue-gray-800 peer-focus:!text-base-content',
							text: 'capitalize',
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
	tooltip: {
		styles: {
			base: {
				tooltip: {
					text: 'capitalize',
					bg: 'bg-base-content/40',
				},
			},
		},
	},
	dialog: {
		styles: {
			base: {
				backdrop: {
					backgroundColor: '',
				},
			},
		},
	},
};

export default theme;
