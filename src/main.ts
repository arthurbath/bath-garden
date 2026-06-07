import './style.scss'

import Draggabilly from 'draggabilly'

const rubbleSymbols = ['📞', '📱', '', '', '✉', '🔿', '✎', '✒', '📎', '', '', '', '➦', '👤', '👥', '', '', '', '', '', '', '➢', '🎯', '', '', '♥', '♡', '★', '☆', '👍', '👎', '', '', '❞', '⌂', '', '🔍', '🔦', '', '🔔', '🔗', '⚑', '⚙', '⚒', '🏆', '', '📷', '📣', '☽', '🎨', '🍂', '♪', '♫', '💥', '🎓', '📕', '📰', '👜', '✈', '', '', '🕔', '🎤', '📅', '⚡', '⛈', '💧', '💿', '💼', '💨', '⏳', '🛇', '🎔', '', '🔑', '🔋', '📾', '', '📽', '☕', '🚀', '', '🛆', '🛈', '🌎', '⌨', '', '', '', '', '', '', '🔅', '🔆', '◑', '', '💻', '∞', '💡', '💳', '📸', '✇', '📋', '', '📦', '🎫', '📶', '💦', '◴', '📊', '🔾', '🔒', '🔓', '⊟', '⊞', '❎', '⊖', '⊕', '✖', '⌫', '', '', '⚠', '🔄', '⟳', '⟲', '🔀', '🔙', '↳', '', '🔁', '', '↰', '⇆', '', '', '⚏', '☰', '📄', '', '', '', '', '🌄', '🎬', '🎵', '📁', '', '', '📤', '📥', '💾', '', '☁', '', '📑', '📖', '▶', '‖', '●', '■', '⏩', '⏪', '', '', '🔊', '🔇', '🕨', '🕩', '🕪', '🕬', '', '', '', '', '', '', '', '']

type Face = 'center' | 'up' | 'right' | 'down' | 'left' | 'ahh'
type Channel = 'static' | 'maybe' | 'eye'

const root = document.documentElement
const tiltAngle = Math.random() * 40 + 50
const tiltDirection = Math.random() < 0.5 ? 1 : -1
root.style.setProperty('--head-tilt-angle', `${tiltAngle * tiltDirection}deg`)

const requireElement = <ElementType extends Element>(selector: string): ElementType => {
	const element = document.querySelector<ElementType>(selector)

	if (!element) {
		throw new Error(`Missing required element: ${selector}`)
	}

	return element
}

const setFace = (artHead: HTMLElement, face: Face) => {
	artHead.dataset.face = face
}

const setChannel = (tvScreen: HTMLElement, channel: Channel) => {
	tvScreen.dataset.channel = channel
}

window.addEventListener('load', () => {
	root.classList.add('is-ready')
})

document.addEventListener('DOMContentLoaded', () => {
	const artHead = requireElement<HTMLElement>('.art-head')
	const tv = requireElement<HTMLElement>('.tv')
	const tvScreen = requireElement<HTMLElement>('.tv__screen')

	const headChange = (event: MouseEvent) => {
		const artHeadRect = artHead.getBoundingClientRect()

		if ((event.clientX > artHeadRect.left && event.clientX < artHeadRect.right) && (event.clientY > artHeadRect.top && event.clientY < artHeadRect.bottom)) {
			setFace(artHead, 'center')
			return
		}

		const artHeadCenter = {
			top: artHeadRect.top + (artHeadRect.height / 2),
			left: artHeadRect.left + (artHeadRect.width / 2),
		}

		const angle = Math.atan2(event.clientY - artHeadCenter.top, event.clientX - artHeadCenter.left) * 180 / Math.PI

		if (angle >= -112.5 && angle <= -67.5) {
			setFace(artHead, 'up')
		}
		else if (angle >= -22.5 && angle <= 22.5) {
			setFace(artHead, 'right')
		}
		else if (angle >= 67.5 && angle <= 112.5) {
			setFace(artHead, 'down')
		}
		else if ((angle >= 157.5 && angle <= 180) || (angle >= -180 && angle <= -157.5)) {
			setFace(artHead, 'left')
		}
		else {
			setFace(artHead, 'center')
		}
	}

	document.addEventListener('mousemove', headChange)

	const draggableHead = new Draggabilly(artHead, {
		containment: '.landscape__sky',
	})

	draggableHead.on('pointerDown', () => {
		setFace(artHead, 'ahh')
		setChannel(tvScreen, 'maybe')
	})

	draggableHead.on('pointerUp', () => {
		setFace(artHead, 'center')
		setChannel(tvScreen, 'static')
	})

	draggableHead.on('dragStart', () => {
		document.removeEventListener('mousemove', headChange)
		setFace(artHead, 'ahh')
	})

	draggableHead.on('dragEnd', () => {
		setFace(artHead, 'ahh')
		setChannel(tvScreen, 'eye')

		const tvBottom = parseFloat(window.getComputedStyle(tv).bottom)
		const dropZone = tvBottom * 0.8
		const dropPadding = tvBottom * 0.1
		const artHeadHeight = parseFloat(window.getComputedStyle(artHead).height)

		const headDropFloor = Math.random() * dropZone + dropPadding
		const headDropFloorTop = window.innerHeight - artHeadHeight - headDropFloor

		root.style.setProperty('--head-drop-ceiling', `${draggableHead.position.y}px`)
		root.style.setProperty('--head-drop-floor', `${headDropFloorTop}px`)

		artHead.classList.add('art-head--dropped')

		const postDrop = (event: AnimationEvent) => {
			event.target?.removeEventListener(event.type, postDrop as EventListener)

			setChannel(tvScreen, 'static')

			const rubble = requireElement<HTMLElement>('.rubble')
			rubble.style.bottom = `${headDropFloor}px`
			rubble.style.left = window.getComputedStyle(artHead).left

			document.querySelectorAll<HTMLElement>('.rubble__bit').forEach(rubbleBit => {
				rubbleBit.textContent = rubbleSymbols[Math.floor(Math.random() * rubbleSymbols.length)]

				window.setTimeout(() => {
					rubbleBit.classList.add('rubble__bit--appeared')
				}, Math.random() * 1000 + 500)
			})

			artHead.classList.add('art-head--faded')

			window.setTimeout(() => {
				requireElement<HTMLElement>('.dog').classList.add('dog--walked')
			}, 4000)
		}

		artHead.addEventListener('animationend', postDrop)
	})
})
