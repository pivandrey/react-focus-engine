import {ContentItem} from "../ContentItem/ContentItem";
import styles from './ContentList.styles.css';
import {blockFocusMovement} from "../../renderer/focusEngine/focusEngine";

const mockData = [
    {
        id: 1,
        title: 'Title1'
    },
    {
        id: 2,
        title: 'Title2'
    },
    {
        id: 3,
        title: 'Title3'
    },
]

export const ContentList = () => {
    return (
        <div className="list">
            {mockData.map((item, index) => (
                <ContentItem
                    focusKey={item.id}
                    key={item.id}
                    data={item.title}
                    nextFocusRight={index === mockData.length - 1 ? blockFocusMovement : undefined}
                />
            ))}
        </div>
    )
}