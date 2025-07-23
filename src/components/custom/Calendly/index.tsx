import React, { useState } from 'react'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { CustomComponentProps } from '../../../utils/customPageComponents'
import './Calendly.css'

interface CalendlyProps extends CustomComponentProps {
	calendlyUrl?: string
	minWidth?: string
	height?: string
}

const Calendly: React.FC<CalendlyProps> = ({
	calendlyUrl = 'https://calendly.com/drcrodriguez',
	height: initialHeight = '300px',
}) => {
	const [height, setHeight] = useState(initialHeight)

	useCalendlyEventListener({
		onPageHeightResize: (e) => {
			setHeight(e.data.payload.height)
		},
	})

	const renderHeight = (hght: string): string => {
		const parsedHeight = parseInt(hght)
		return `${Math.min(Math.max(parsedHeight, 300), 700)}px`
	}

	return (
		<div className='calendly-container'>
			<InlineWidget
				url={calendlyUrl}
				styles={{
					width: '90vw',
					maxWidth: '720px',
					height: renderHeight(height),
				}}
			/>
		</div>
	)
}

export default Calendly
