import React from 'react'
import './Section.css'
import { StyleSettings } from '../../../types/sanity'
import { parseCustomCSS } from '../../../utils/parseCustomCSS'

interface SectionProps {
	block: any
	nextSectionAngled?: boolean
	nextSectionColor?: string
	prevSectionAngled?: boolean
	prevSectionColor?: string
	children?: React.ReactNode
}

const Section: React.FC<SectionProps> = ({
	block,
	nextSectionAngled,
	nextSectionColor,
	prevSectionAngled,
	prevSectionColor,
	children,
}) => {
	// Extract values from block
	const {
		backgroundColor = 'transparent',
		angled = false,
		content = [],
		sectionColor,
		styles,
	}: any = block

	// Add extra space for overlays
	const extraTop = prevSectionAngled ? 'calc(16vw + 1rem)' : '1rem'
	const extraBottom = nextSectionAngled ? 'calc(16vw + 1rem)' : '1rem'

	// Check if section contains columns
	const hasColumns = content.some((block: any) => block._type === 'column')

	const sectionStyle: React.CSSProperties = {
		backgroundColor: styles?.backgroundColor || backgroundColor,
		position: 'relative',
		paddingTop: extraTop,
		paddingBottom: extraBottom,
	}

	const contentStyle: React.CSSProperties = {
		// Add explicit flex styling when columns are present
		...(hasColumns && {
			display: 'flex',
			alignItems: 'flex-start',
			justifyContent: 'space-between',
			gap: '1rem',
		}),
		...parseCustomCSS(styles?.customCSS),
	}

	return (
		<div
			className={`section${angled ? ' section-angled' : ''}`}
			style={sectionStyle}
			data-label={block?.label}
		>
			{/* Top overlay if previous section is angled */}
			{prevSectionAngled && prevSectionColor && (
				<div
					className='section-angled-overlay top-right'
					style={{ backgroundColor: prevSectionColor }}
				/>
			)}
			<div
				className={`section-content${hasColumns ? ' section-with-columns' : ''}`}
				style={contentStyle}
			>
				{children}
			</div>
			{/* Bottom overlay if next section is angled */}
			{nextSectionAngled && nextSectionColor && (
				<div
					className='section-angled-overlay bottom-left'
					style={{ backgroundColor: nextSectionColor }}
				/>
			)}
		</div>
	)
}

export default Section
