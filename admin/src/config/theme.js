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
								'focus:!border-primary dark:border-blue-gray-800 focus:!border-t-transparent dark:focus:!border-t-transparent !border-t-transparent dark:!border-t-transparent',
						},
						label: {
							borderColor:
								'dark:peer-focus:before:!border-primary dark:peer-focus:after:!border-primary peer-focus:before:!border-primary peer-focus:after:!border-primary peer-focus:!text-primary dark:before:border-blue-gray-800 dark:after:border-blue-gray-800',
							text: 'capitalize',
						},
					},
				},
			},
		},
	},
	textarea: {
		styles: {
			base: {
				textarea: {
					placeholder: 'placeholder-base-content/60',
					color: 'text-base-content',
				},
			},
			variants: {
				outlined: {
					base: {
						textarea: {
							borderColor:
								'focus:!border-primary dark:focus:!border-primary !border-t-blue-gray-200 dark:!border-blue-gray-800 focus:!border-t-transparent dark:focus:!border-t-transparent',
						},
						label: {
							borderColor:
								'dark:peer-focus:before:!border-primary dark:peer-focus:after:!border-primary peer-focus:before:!border-primary peer-focus:after:!border-primary dark:peer-focus:before:!border-primary dark:peer-focus:after:!border-primary peer-focus:!text-primary dark:before:border-blue-gray-800 dark:after:border-blue-gray-800',
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
				container: {
					backgroundColor: 'bg-base-100',
				},
			},
		},
	},
	dialogHeader: {
		styles: {
			base: {
				color: 'text-base-content',
			},
		},
	},
	dialogBody: {
		styles: {
			base: {
				color: 'text-base-content/80',
			},
		},
	},
};

export default theme;
