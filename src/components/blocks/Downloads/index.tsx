import React from 'react'
import './Downloads.css'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '../../../utils/portableTextComponents'

interface DownloadsProps {
	block: {
		_key?: string
		_id?: string
		_type: 'downloads'
		title?: string
		description?: any
		downloads?: Array<{
			_id: string
			title: string
			description?: string
			link: string
			filename: string
		}>
	}
}

const Downloads: React.FC<DownloadsProps> = ({ block }) => {
	return (
		<div key={block._key || block._id} className='downloads-section'>
			{block.title && <h2 className='section-title'>{block.title}</h2>}
			{block.description && (
				<div className='rich-text'>
					<PortableText
						value={block.description?.content}
						components={portableTextComponents}
					/>
				</div>
			)}
			{block.downloads && block.downloads.length > 0 && (
				<div className='downloads-grid'>
					{block.downloads.map((download) => (
						<div key={download._id} className='download-item'>
							<h4>
								<a
									href={download.link}
									className='download-link'
									target='_blank'
									rel='noopener noreferrer'
								>
									{download.title}
								</a>
							</h4>
							{download.description && <p>{download.description}</p>}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Downloads
