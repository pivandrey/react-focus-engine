import {Key} from "./keys";
import {Direction} from "./direction";
import {first} from "../../utils/indexable";
import {sortBy, without} from "../../utils/array";
import {isNil} from "../../utils/object";
import {Layout} from "./layout";

export const domDataAttribute = 'data-ffocusable'
export const focusKeyAttribute = 'data-ffocus-key'
export const focusDepthAttribute = 'data-ffocus-depth'
export const nextFocusDataAttributePrefix = 'data-next-ffocus'
export const blockFocusMovement = 'block-focus-movement'
export const nextFocusDataAttribute = {
    up: `${nextFocusDataAttributePrefix}-up`,
    right: `${nextFocusDataAttributePrefix}-right`,
    down: `${nextFocusDataAttributePrefix}-down`,
    left: `${nextFocusDataAttributePrefix}-left`,
}

let listeners = []
let layoutListeners = []
let currentLayout = Layout.Page

function querySelectFocusableElements () {
    return document.querySelectorAll(`[${domDataAttribute}='true'][${focusDepthAttribute}='${getDepthByLayout()}']`)
}

function toString (element) {
    const dataFocusKey = element.getAttribute(focusKeyAttribute)
    return [element.tagName || ''].concat(dataFocusKey ? [`$${dataFocusKey}`] : []).join('')
}

function focused () {
    return document.activeElement
}

function dispatchClick (currentFocusedElement) {
    if (currentFocusedElement.click) {
        currentFocusedElement.click()
        return true
    } else if (currentFocusedElement.dispatchEvent) {
        const mouseEvent = document.createEvent('MouseEvents')
        mouseEvent.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, currentFocusedElement)
        currentFocusedElement.dispatchEvent(mouseEvent)
        return true
    }
}

export function onKeyDown (key) {
    const currentFocusedElement = focused()

    const currentFocusedElementName = currentFocusedElement == null ? null : toString(currentFocusedElement)

    if (currentFocusedElement != null && key === Key.Enter) {
        dispatchClick(currentFocusedElement, currentFocusedElementName)
        return true
    }

    return moveFocusByDirection(key)
}

function moveFocusByDirection (key) {
    const direction = keyToDirection(key)

    if (direction == null) {
        return false
    }

    return focusByDirection(direction)
}

function keyToDirection (key) {
    const map = {
        [Key.Up]: Direction.Up,
        [Key.Down]: Direction.Down,
        [Key.Left]: Direction.Left,
        [Key.Right]: Direction.Right,
    }

    return map[key]
}

export function focus (focusKey) {
    const [element, elementDepth] = querySelectByFocusKey(focusKey)
    if (element == null || elementDepth == null) {
        return false
    }

    const currentLayout = getDepthByLayout()
    if (elementDepth !== currentLayout) {
        return false
    }

    return focusElement(element)
}

function querySelectByFocusKey (focusKey) {
    const element = document.querySelector(`[${focusKeyAttribute}=${focusKey}]`)
    if (element) {
        const elementDepth = element.getAttribute(focusDepthAttribute)
        return [element, elementDepth ? Number(elementDepth) : null]
    }
    return [null, null]
}

function focusElement (element) {
    element.focus({ preventScroll: true })

    let parent = element.parentNode
    while (parent != null && parent != document) {
        parent.scrollTop = 0
        parent.scrollLeft = 0
        parent = parent.parentNode
    }
    onFocusKeyChange()
    return true
}

function blurElement (element) {
    element.blur()
    return true
}

function onFocusKeyChange () {
    const currentFocusKey = getCurrentFocusKey()
    if (currentFocusKey) {
        listeners.forEach(listener => {
            listener(currentFocusKey)
        })
    }
}

function getCurrentFocusKey () {
    const focusedElement = focused()
    return focusedElement !== null ? focusedElement.getAttribute(focusKeyAttribute) : ''
}

function getDepthByLayout () {
    return currentLayout === Layout.Modal ? 1 : 0
}

export function setLayout (layout) {
    currentLayout = layout
    changeLayoutEvent()
}

function changeLayoutEvent () {
    layoutListeners.forEach(listener => listener(currentLayout))
}

function focusByDirection (direction) {
    const currentFocusedElement = focused()

    if (currentFocusedElement != null) {
        const directionDataAttribute = `${nextFocusDataAttributePrefix}-${direction}`
        const nextInDirectionFocusKey = currentFocusedElement.getAttribute(directionDataAttribute)
        const [nextInDirection] = nextInDirectionFocusKey == null ? [null] : querySelectByFocusKey(nextInDirectionFocusKey)
        if (nextInDirection != null) {
            focusElement(nextInDirection)
            return true
        }

        if (nextInDirectionFocusKey === blockFocusMovement) {
            return true
        }

        if (nextInDirection == null && nextInDirectionFocusKey != null) {
            return false
        }
    }

    const allFocusableElements = querySelectFocusableElements()
    const firstFocusableElement = first(allFocusableElements)

    if (currentFocusedElement == null || currentFocusedElement === document.body) {
        if (firstFocusableElement != null) {
            focusElement(firstFocusableElement)
        }
        return true
    }

    const directionNavigatableElements = Array.from(allFocusableElements).filter(element =>
        inDirectionHalfPlane(direction, currentFocusedElement, element)
    )

    const otherFocusableElements = without([currentFocusedElement], directionNavigatableElements)

    const centerOfSideCurrent = centerOfSide(direction, currentFocusedElement)

    const oppositeDirection = opposite(direction)

    const nearest = first(
        sortBy(
            element =>
                distance(
                    centerOfSideCurrent,
                    centerOfSide(oppositeDirection, element) // center(element)
                ),
            otherFocusableElements
        )
    )

    if (!isNil(nearest)) {
        blurElement(currentFocusedElement)
        focusElement(nearest)
        return true
    }

    return false
}

function inDirectionHalfPlane (direction, source, target) {
    const sourceDirectionSideCenter = centerOfSide(direction, source)
    const targetDirectionSideCenter = center(target)
    return direction === 'left'
        ? sourceDirectionSideCenter.left >= targetDirectionSideCenter.left
        : direction === 'right'
            ? sourceDirectionSideCenter.left <= targetDirectionSideCenter.left
            : direction === 'up'
                ? sourceDirectionSideCenter.top >= targetDirectionSideCenter.top
                : sourceDirectionSideCenter.top <= targetDirectionSideCenter.top
}

function centerOfSide (direction, element) {
    const { top, left, width, height } = element.getBoundingClientRect()

    const map = {
        up: { top, left: left + width / 2 },
        down: { top: top + height, left: left + width / 2 },
        left: { left, top: top + height / 2 },
        right: { top: top + height / 2, left: left + width },
    }

    return map[direction]
}

function center (element) {
    const { top, left, width, height } = element.getBoundingClientRect()
    return { top: top + height / 2, left: left + width / 2 }
}

function opposite (direction) {
    const map = {
        [Direction.Up]: Direction.Down,
        [Direction.Down]: Direction.Up,
        [Direction.Left]: Direction.Right,
        [Direction.Right]: Direction.Left,
    }

    return map[direction]
}

function distance (a, b) {
    return Math.hypot(a.left - b.left, a.top - b.top)
}