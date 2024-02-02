import {Button} from "../button/Button";
import * as S from './PlayerControls.styles.css';
import {withViewProps} from "../../renderer/hoc/withViewProps";

export const PlayerControls = withViewProps(({ viewProps }) => {
    return (
        <div className={S.wrapper}>
            <div className={S.leftPart}>
                <Button onClick={() => {}} content={'Like'} {...viewProps} />
                <div className={S.gap} />
                <Button onClick={() => {}} content={'Subscribe'} {...viewProps} />
                <div className={S.gap} />
                <Button onClick={() => {}} content={'Owner'} {...viewProps} />
            </div>

            <div className={S.rightPart}>
                <Button onClick={() => {}} content={'settings'} {...viewProps} />
            </div>
        </div>
    )
})