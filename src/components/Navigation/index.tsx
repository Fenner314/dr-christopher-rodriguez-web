import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg'
import { ReactComponent as PersonIcon } from '../../assets/icons/person.svg'
import { ReactComponent as ImagesIcon } from '../../assets/icons/images.svg'
import { ReactComponent as MailIcon } from '../../assets/icons/mail.svg'
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg'
import { ReactComponent as PageIcon } from '../../assets/icons/document.svg'
import { ReactComponent as SchoolIcon } from '../../assets/icons/school-outline.svg'
import { usePagesContext } from '../../contexts/PagesContext'
import './Navigation.css'

const defaultNavItems = [
	{
		icon: <HomeIcon data-label='home-icon' />,
		label: 'Home',
		path: '/',
	},
	{
		icon: <PersonIcon data-label='about-icon' />,
		label: 'About',
		path: '/about',
	},
	{
		icon: <ImagesIcon data-label='gallery-icon' />,
		label: 'Gallery',
		path: '/gallery',
	},
	{
		icon: <CalendarIcon data-label='calendar-icon' />,
		label: 'Calendar',
		path: '/calendar',
	},
	{
		icon: <SchoolIcon data-label='teaching-icon' />,
		label: 'Teaching',
		path: '/teaching',
	},
	{
		icon: <MailIcon data-label='mail-icon' />,
		label: 'Contact',
		path: '/contact',
	},
]

const Navigation = () => {
	const location = useLocation()
	const path = location.pathname === '/' ? 'home' : location.pathname.slice(1)
	const { pages, isLoading } = usePagesContext()
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

	const navBarRef = useRef<HTMLDivElement>(null)
	const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([])
	const [indicatorStyle, setIndicatorStyle] = useState<{
		left: number
		width: number
	}>({ left: 0, width: 0 })

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// Use default nav items while loading or if no pages are found
	const navItems =
		!isLoading && pages.length > 0
			? pages
					.map((page) => ({
						icon: defaultNavItems.find(
							(item) =>
								item.path ===
								(page.slug?.current === '/'
									? '/'
									: `/${page.slug?.current.split('/')[1]}`)
						)?.icon || <PageIcon />,
						label: page.title,
						path:
							page.slug?.current === '/'
								? '/'
								: `/${page.slug?.current.split('/')[1]}`,
						index: page.index,
					}))
					.sort((a, b) => a.index - b.index)
			: defaultNavItems

	const activeIndex = navItems.findIndex((item) =>
		item.path === '/' ? path === 'home' : item.path.slice(1) === path
	)

	const isValidPage = activeIndex !== -1

	// Update indicator position and scroll selected item into view (mobile only)
	useEffect(() => {
		if (!isMobile || !isValidPage) return
		const el = navItemRefs.current[activeIndex]
		const navBar = navBarRef.current
		if (el && navBar) {
			setIndicatorStyle({
				left: el.offsetLeft - navBar.scrollLeft,
				width: el.offsetWidth,
			})
			el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
		}
	}, [activeIndex, isMobile, navItems.length, isValidPage])

	const desktopIndicatorStyle = isValidPage
		? {
				// vertical nav
				top: `calc(50% - ${(navItems.length * 76) / 2}px + ${activeIndex * 76}px)`,
				height: '64px',
				'--indicator-height': '64px',
			}
		: {
				display: 'none',
			}

	return (
		<nav className='mobile-nav'>
			<div className='nav-indicator-container'>
				<div
					className='nav-indicator'
					style={
						isMobile
							? { left: indicatorStyle.left, width: indicatorStyle.width }
							: desktopIndicatorStyle
					}
				/>
			</div>
			<div className='nav-items' ref={navBarRef}>
				{navItems.map((item, idx) => (
					<Link
						key={item.label}
						to={item.path}
						ref={(el) => {
							navItemRefs.current[idx] = el
						}}
						className={`nav-item ${
							(item.path === '/' ? path === 'home' : item.path.slice(1) === path)
								? 'active'
								: ''
						}`}
					>
						{item.icon}
						<span className='nav-label'>{item.label}</span>
					</Link>
				))}
			</div>
		</nav>
	)
}

export default Navigation
