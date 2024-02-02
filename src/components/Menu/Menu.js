import {Button} from "../Button/Button";
import styles from './Menu.styles.css';
import {useEffect} from "react";
import {focus} from "../../renderer/focusEngine/focusEngine";

const subtitlesFocusKey = 'subtitles'
const closeModalFocusKey = 'closeModal'
const qualityFocusKey = 'quality'
const someAnotherFocusKey = 'someAnother'

export const Menu = ({ focusDepth, onCloseMenu }) => {
    useEffect(() => {
        focus(subtitlesFocusKey);
    }, [])

    return (
        <div className="modal">
            <Button
                focusKey={closeModalFocusKey}
                content={'Close modal'}
                focusDepth={focusDepth}
                onClick={onCloseMenu}
            />

            <div className={'gap'} />
            <span>I'm modal</span>
            <div className={'gap'} />

            <div className="modalButtons">
                <Button
                    focusKey={subtitlesFocusKey}
                    content={'subtitles'}
                    focusDepth={focusDepth}
                    onClick={() => {}}
                />
                <div className={'gap'} />
                <Button
                    focusKey={qualityFocusKey}
                    content={'quality'}
                    focusDepth={focusDepth}
                    onClick={() => {}}
                />
                <div className={'gap'} />
                <Button
                    focusKey={someAnotherFocusKey}
                    content={'someAnother'}
                    focusDepth={focusDepth}
                    onClick={() => {}}
                />
            </div>
        </div>
    )
}