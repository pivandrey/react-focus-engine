import './App.css';
import {
    likeFocusKey,
    ownerFocusKey,
    PlayerControls,
    settingsFocusKey
} from "./components/PlayerControlls/PlayerControls";
import {useEffect, useState} from "react";
import {Layout} from "./renderer/focusEngine/layout";
import {focus, setLayout} from "./renderer/focusEngine/focusEngine";
import {Menu} from "./components/Menu/Menu";
import {ContentList} from "./components/ContentList/ContentList";

function App() {
    const [showMenu, setShowMenu] = useState(false);

    const handleShowMenu = () => {
        setLayout(Layout.Modal);
        setShowMenu(true);
    }

    const handleCloseMenu = () => {
        setLayout(Layout.Page);
        setShowMenu(false);
        focus(ownerFocusKey);
    }

    useEffect(() => {
        focus(likeFocusKey);
    }, [])

    return (
        <div className="App">
            <PlayerControls onShowMenu={handleShowMenu} />
            {showMenu && <Menu focusDepth={1} onCloseMenu={handleCloseMenu} />}
            <ContentList />
        </div>
    );
}

export default App;
