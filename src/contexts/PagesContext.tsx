import React, { createContext, useContext, useState, useEffect } from 'react'
import { client } from '../lib/sanity'

interface PageData {
	_id: string
	title: string
	slug: { current: string }
	pageType?: string
	content?: any[]
	customComponent?: string
	index: number
}

interface ParallaxSection {
	id: string
	page?: string
	component: React.ReactNode
	position?: number // viewport height offset (e.g., 0 for first hero, 150 for second section)
}

interface PagesContextType {
	pages: PageData[]
	currentPage: PageData | null
	isLoading: boolean
	error: string | null
	lastUpdated?: string
	// Parallax functionality
	parallaxSections: ParallaxSection[]
	registerParallaxSection: (section: ParallaxSection) => void
	unregisterParallaxSection: (id: string) => void
	clearParallaxSections: () => void
	findParallaxSection: (id: string) => ParallaxSection | undefined
	updateParallaxSectionPosition: (id: string, position: number) => void
}

const CACHE_KEY = 'pages_cache'
const CACHE_TIMESTAMP_KEY = 'pages_cache_timestamp'
// Cache expiry time - 24 hours
const CACHE_EXPIRY = 24 * 60 * 60 * 1000

const PagesContext = createContext<PagesContextType>({
	pages: [],
	currentPage: null,
	isLoading: true,
	error: null,
	parallaxSections: [],
	registerParallaxSection: () => {},
	unregisterParallaxSection: () => {},
	clearParallaxSections: () => {},
	findParallaxSection: () => undefined,
	updateParallaxSectionPosition: () => {},
})

export const usePagesContext = () => useContext(PagesContext)

export const PagesProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [pages, setPages] = useState<PageData[]>(() => {
		// Initialize from cache if available
		const cached = localStorage.getItem(CACHE_KEY)
		return cached ? JSON.parse(cached) : []
	})
	const [currentPage, setCurrentPage] = useState<PageData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [lastUpdated, setLastUpdated] = useState<string>(() => {
		return localStorage.getItem(CACHE_TIMESTAMP_KEY) || ''
	})

	// Parallax state
	const [parallaxSections, setParallaxSections] = useState<ParallaxSection[]>([])

	const findParallaxSection = (id: string) => {
		return parallaxSections.find((section) => section.id === id)
	}

	const saveToCache = (data: PageData[]) => {
		try {
			localStorage.setItem(CACHE_KEY, JSON.stringify(data))
			const timestamp = new Date().toISOString()
			localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp)
			setLastUpdated(timestamp)
		} catch (err) {
			console.warn('Failed to save to cache:', err)
		}
	}

	const isCacheValid = (): boolean => {
		const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
		if (!timestamp) return false

		const lastUpdate = new Date(timestamp).getTime()
		const now = new Date().getTime()
		return now - lastUpdate < CACHE_EXPIRY
	}

	const fetchAllPages = async (updateCache = true) => {
		try {
			const query = `*[_type == "page"]{
				_id,
				title,
				slug,
				pageType,
				customComponent,
				index,
				content[]{
					...,
					downloads[]->,
					button->,
					_type == "section" => {
						...,
						content[]{
							...,
							_type == "gallery" => {
								...,
								items[]{
									_key,
									"data": *[_id == ^._ref][0]{
										_id,
										_type,
										title,
										image,
										alt,
										styles,
										width,
										borderRadius,
										description,
										organization,
										role,
										year,
										director,
										conductor,
										photographer,
										youtubeUrl,
										content
									}
								}
							},
							_type == "videoGallery" => {
								...,
								items[]{
									_key,
									"data": *[_id == ^._ref][0]{
										_id,
										_type,
										title,
										url,
										description
									}
								}
							}
						}
					},
					images[]{
						_key,
						"data": *[_id == ^._ref][0]{
							_id,
							_type,
							title,
							image,
							alt,
							styles,
							width,
							borderRadius,
							description,
							organization,
							role,
							year,
							director,
							conductor,
							photographer
						}
					}
				}
			}`

			// @ts-ignore
			const data = await client.fetch(query)
			setPages(data)

			if (updateCache) {
				saveToCache(data)
			}

			return data
		} catch (err) {
			console.error('Error fetching all pages:', err)
			setError('Failed to load pages')
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	// Parallax functions
	const registerParallaxSection = (section: ParallaxSection) => {
		setParallaxSections((prev) => {
			// Remove any existing section with the same id, then add the new one
			const filtered = prev.filter((s) => s.id !== section.id)
			return [...filtered, section].sort(
				(a, b) => (a?.position ?? 0) - (b?.position ?? 0)
			)
		})
	}

	const unregisterParallaxSection = (id: string) => {
		setParallaxSections((prev) => prev.filter((s) => s.id !== id))
	}

	const clearParallaxSections = () => {
		setParallaxSections([])
	}

	const updateParallaxSectionPosition = (id: string, position: number) => {
		setParallaxSections((prev) => {
			const updated = prev.map((s) => {
				if (s.id === id) {
					const newSection = { ...s, position }
					return newSection
				}
				return s
			})
			return updated.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
		})
	}

	useEffect(() => {
		const initializeData = async () => {
			// Check if we have valid cached data
			const cachedData = localStorage.getItem(CACHE_KEY)
			const hasValidCache = cachedData && isCacheValid()

			if (hasValidCache) {
				// Use cached data immediately
				setPages(JSON.parse(cachedData))
				setIsLoading(false)

				// Fetch fresh data in the background
				try {
					await fetchAllPages(true)
				} catch (err) {
					// If background fetch fails, we still have cached data
					console.warn('Background fetch failed:', err)
				}
			} else {
				// No valid cache, do a normal fetch
				try {
					await fetchAllPages(true)
				} catch (err) {
					setError('Failed to load pages')
					setIsLoading(false)
				}
			}
		}

		initializeData()
	}, [])

	const value = {
		pages,
		currentPage,
		isLoading,
		error,
		lastUpdated,
		parallaxSections,
		registerParallaxSection,
		unregisterParallaxSection,
		clearParallaxSections,
		findParallaxSection,
		updateParallaxSectionPosition,
	}

	return <PagesContext.Provider value={value}>{children}</PagesContext.Provider>
}
