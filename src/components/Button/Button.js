import {withViewProps} from "../../renderer/hoc/withViewProps";
import {domDataAttribute} from "../../renderer/focusEngine/focusEngine";

export const Button = withViewProps(({ content, onClick, ...viewProps }) => {
    return <button onClick={onClick} {...viewProps}>{content}</button>
})