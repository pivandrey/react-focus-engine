import {Button} from "../Button/Button";
import styles from './PlayerControls.styles.css';

export const settingsFocusKey = 'settings';
export const likeFocusKey = 'like';
export const subscribeFocusKey = 'subscribe';
export const ownerFocusKey = 'owner';

export const PlayerControls = ({ onShowMenu }) => {
    return (
        <div className={'wrapper'}>
            <div className={'leftPart'}>
                <Button focusKey={likeFocusKey} onClick={() => {}} content={'Like'} />
                <div className={'gap'} />
                <Button focusKey={subscribeFocusKey} onClick={() => {}} content={'Subscribe'} />
                <div className={'gap'} />
                <Button
                    focusKey={ownerFocusKey}
                    nextFocusRight={settingsFocusKey}
                    onClick={() => {}}
                    content={'Owner'}
                />
            </div>

            <div className={'rightPart'}>
                <Button
                    focusKey={settingsFocusKey}
                    nextFocusLeft={ownerFocusKey}
                    onClick={onShowMenu}
                    content={'settings'}
                />
            </div>
        </div>
    )
}