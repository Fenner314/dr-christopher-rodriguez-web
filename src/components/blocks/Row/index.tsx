import React from 'react'
import renderBlock from '../../../utils/renderBlock'
import './Row.css'

interface RowProps {
	block: {
		_key?: string
		_id?: string
		_type: 'row'
		columns?: any[]
		alignment?:
			| 'flex-start'
			| 'center'
			| 'flex-end'
			| 'space-between'
			| 'space-around'
			| 'space-evenly'
		gap?: string
		wrap?: boolean
		label?: string
		title?: string
	}
}

const Row: React.FC<RowProps> = ({ block }) => {
	const {
		columns = [],
		alignment = 'flex-start',
		gap = '2rem',
		wrap = true,
		label,
	} = block

	const rowStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: alignment,
		gap,
		flexWrap: wrap ? 'wrap' : 'nowrap',
		alignItems: 'flex-start',
		width: '100%',
	}

	return (
		<div className='row-block' style={rowStyle} data-label={label}>
			{columns.map((column: any) => renderBlock(column))}
		</div>
	)
}

export default Row
