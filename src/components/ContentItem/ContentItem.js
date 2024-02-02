import {withViewProps} from "../../renderer/hoc/withViewProps";
import styles from './ContentItem.styles.css'

export const ContentItem = withViewProps(({ data, key, ...viewProps }) => {
    return (
        <button className="item" {...viewProps} key={key}>
            {data}
        </button>
    )
})