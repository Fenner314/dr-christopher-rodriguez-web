import React from 'react'
import renderBlock from '../../../utils/renderBlock'
import './VideoGallery.css'

interface VideoGalleryProps {
	block: {
		_key?: string
		_id?: string
		_type: 'videoGallery'
		items?: any[]
		label?: string
		title?: string
	}
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ block }) => {
	const { items = [], label, title } = block

	if (!items || items.length === 0) {
		return null
	}

	return (
		<div className='video-gallery-block' data-label={label}>
			{title && <h2 className='video-gallery-title'>{title}</h2>}
			<div className='video-gallery-grid'>
				{items.map((item: any) => {
					const videoData = item?.data || item
					const renderedBlock = renderBlock(videoData, { isInVideoGrid: true })

					return (
						<div key={item._key || videoData._id} className='video-item-container'>
							{renderedBlock}
							{videoData?.title && (
								<h3 className='video-item-title'>{videoData.title}</h3>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default VideoGallery
