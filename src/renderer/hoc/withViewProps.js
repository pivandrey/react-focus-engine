import {
    domDataAttribute,
    focusDepthAttribute,
    focusKeyAttribute,
    nextFocusDataAttribute,
    onKeyDown
} from "../focusEngine/focusEngine";
import {inverseKeyMap} from "../focusEngine/keys";

export const withViewProps = (WrappedComponent) => {
    return ({ focusKey, focusDepth, nextFocusRight, nextFocusLeft, ...props }) => {
        const additionalProps = {}
        if (focusKey) {
            additionalProps[domDataAttribute] = true;
            additionalProps[focusKeyAttribute] = focusKey;
        }

        if (nextFocusRight) {
            additionalProps[nextFocusDataAttribute.right] = nextFocusRight;
        }

        if (nextFocusLeft) {
            additionalProps[nextFocusDataAttribute.left] = nextFocusLeft;
        }

        additionalProps[focusDepthAttribute] = focusDepth ? focusDepth : 0;
        additionalProps.onKeyDown = (event) => {
            onKeyDown(inverseKeyMap[event.keyCode])
        }

        return <WrappedComponent {...props} {...additionalProps} />
    }
}