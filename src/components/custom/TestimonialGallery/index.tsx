import React, { useState, useEffect, useRef } from 'react'
import { TestimonialGallery } from '../../../types/sanity'
import './TestimonialGallery.css'
import { urlForImage } from '../../../lib/sanity'
import { ReactComponent as FaChevronLeft } from '../../../assets/icons/chevron-back-outline.svg'
import { ReactComponent as FaChevronRight } from '../../../assets/icons/chevron-forward-outline.svg'

interface TestimonialGalleryProps {
	block: TestimonialGallery
}

const AUTO_ADVANCE_MS = 8000

const TestimonialGalleryComponent: React.FC<TestimonialGalleryProps> = ({
	block,
}) => {
	const { title, image, testimonials } = block
	const [current, setCurrent] = useState(0)
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const isPaused = useRef(false)

	// Auto-advance logic
	useEffect(() => {
		if (isPaused.current) return
		timerRef.current = setTimeout(() => {
			setCurrent((prev) => (prev + 1) % testimonials.length)
		}, AUTO_ADVANCE_MS)
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [current, testimonials.length])

	// Pause on hover/focus
	const pause = () => {
		isPaused.current = true
		if (timerRef.current) clearTimeout(timerRef.current)
	}
	const resume = () => {
		isPaused.current = false
		setCurrent((c) => c) // trigger useEffect
	}

	const goTo = (idx: number) => {
		setCurrent(idx)
	}
	const prev = () => {
		setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
	}
	const next = () => {
		setCurrent((prev) => (prev + 1) % testimonials.length)
	}

	const t = testimonials[current]

	return (
		<div
			className='testimonial-gallery-root'
			// onMouseEnter={pause}
			// onMouseLeave={resume}
			// onFocus={pause}
			// onBlur={resume}
			tabIndex={0}
		>
			<div className='testimonial-gallery-content'>
				<div>
					{title && <div className='testimonial-gallery-title'>{title}</div>}
					<div className='testimonial-gallery-quote'>
						&quot;{t.quote}&quot;
						<div className='testimonial-gallery-name'>
							-{t.name}
							{t.label && <span> ({t.label})</span>}
						</div>
					</div>
				</div>
				<div className='testimonial-gallery-image'>
					<div className='testimonial-gallery-image-inner'>
						{block.image && block.image.asset && (
							<img
								src={urlForImage(block.image).url()}
								alt='Christopher Rodriguez'
								loading='lazy'
							/>
						)}
					</div>
				</div>
			</div>
			<div className='testimonial-gallery-arrows'>
				<button
					className='testimonial-gallery-arrow'
					aria-label='Previous testimonial'
					onClick={prev}
				>
					<FaChevronLeft />
				</button>
				<button
					className='testimonial-gallery-arrow'
					aria-label='Next testimonial'
					onClick={next}
				>
					<FaChevronRight />
				</button>
			</div>
			<div className='testimonial-gallery-dots'>
				{testimonials.map((_, idx) => (
					<button
						key={idx}
						className={'testimonial-gallery-dot' + (idx === current ? ' active' : '')}
						aria-label={`Go to testimonial ${idx + 1}`}
						onClick={() => goTo(idx)}
					/>
				))}
			</div>
		</div>
	)
}

export default TestimonialGalleryComponent
