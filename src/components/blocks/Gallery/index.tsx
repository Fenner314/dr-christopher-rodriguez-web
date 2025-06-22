import React, { useRef } from 'react'
import renderBlock from '../../../utils/renderBlock'
import './Gallery.css'

interface GalleryProps {
	block: {
		_key?: string
		_id?: string
		_type: 'gallery'
		items?: any[]
		label?: string
		title?: string
	}
}

const Gallery: React.FC<GalleryProps> = ({ block }) => {
	const { items = [], label, title } = block
	const scrollRef = useRef<HTMLDivElement>(null)

	const scroll = (direction: 'left' | 'right') => {
		if (scrollRef.current) {
			const scrollAmount = direction === 'left' ? -230 : 230 // 215px width + 15px gap
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
		}
	}

	if (!items || items.length === 0) {
		return null
	}

	return (
		<div className='gallery-block' data-label={label}>
			{title && <h2 className='gallery-title'>{title}</h2>}
			<div className='gallery-carousel-wrapper'>
				<button
					className='gallery-arrow left'
					onClick={() => scroll('left')}
					aria-label='Scroll left'
				>
					&lt;
				</button>
				<div className='gallery-content' ref={scrollRef}>
					{items.map((child: any) =>
						renderBlock(child?.data, { isInMediaGrid: true })
					)}
				</div>
				<button
					className='gallery-arrow right'
					onClick={() => scroll('right')}
					aria-label='Scroll right'
				>
					&gt;
				</button>
			</div>
		</div>
	)
}

export default Gallery
