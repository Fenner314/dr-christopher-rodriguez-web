// TypeScript types for Sanity content

export interface StyleSettings {
	backgroundColor?: string
	customCSS?: string
	textAlign?: 'left' | 'center' | 'right'
}

export interface BlockBase {
	_id: string
	_key: string
	label?: string
	styles?: StyleSettings
}

export interface Page extends BlockBase {
	title: string
	pageType: 'home' | 'about' | 'media' | 'contact'
}

export interface Biography extends BlockBase {
	title: string
	content: any[] // Portable Text array
	sortOrder: number
	assignedPage: Page
}

export interface Button extends BlockBase {
	title?: string
	text?: string
	url?: string
	buttonType?: 'contained' | 'outlined' | 'text'
	colorScheme?: 'primary' | 'secondary' | 'accent'
	width?: 'stretch' | 'fit'
	size?: 'small' | 'medium' | 'large'
	customStyles?: {
		backgroundColor?: { hex: string }
		textColor?: { hex: string }
	}
	openInNewTab: boolean
	ariaLabel?: string
}

export interface Quote extends BlockBase {
	quoteText: string
	author?: string
}

export interface DownloadItem extends BlockBase {
	title: string
	description?: string
	linkUrl: string
}

export interface MediaImage extends BlockBase {
	title: string
	image: any
	description?: string
	organization?: string
	youtubeUrl?: string
}

export interface VideoRecording extends BlockBase {
	title: string
	description?: string
	url: string
	organization?: string
}

export interface Event extends BlockBase {
	title: string
	date: string
	description?: string
	location?: string
	featured: boolean
	button?: Button
}

export interface Hero extends BlockBase {
	title?: string
	text?: any[] // Portable Text array
	image?: any
	parallax?: boolean
}

export interface MediaGrid extends BlockBase {
	title?: string
	images: MediaImage[]
}

export interface BlockBanner extends BlockBase {
	title?: string
	text?: any[] // Portable Text array
	image?: any
}

export interface Downloads extends BlockBase {
	title?: string
	items: DownloadItem[]
}

export interface CustomComponent extends BlockBase {
	componentName: string
	props?: string // JSON string
}

export interface Testimonial extends BlockBase {
	label?: string
	quote: string
	name: string
	title?: string
	company?: string
	image?: any
	rating?: number
}

export interface TestimonialGallery extends BlockBase {
	title: string
	image?: any
	testimonials: Testimonial[]
}

export interface Column extends BlockBase {
	title?: string
	content?: any[]
	alignment?: 'left' | 'center' | 'right'
	width?: string
	padding?: string
}

export interface Row extends BlockBase {
	title?: string
	columns?: Column[]
	alignment?:
		| 'flex-start'
		| 'center'
		| 'flex-end'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
	gap?: string
	wrap?: boolean
}
