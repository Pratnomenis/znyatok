import {
    menuConst
} from "../constants/menu.const.js";
import {
    menuStore
} from "../stores/menu.store.js";
import {
    ColorsTab
} from "./tabs/colors-tab.component.js";
import {
    GeneralTab
} from "./tabs/general-tab.component.js";
import {
    HotkeysTab
} from "./tabs/hotkeys-tab.component.js";
import {
    ToolsTab
} from "./tabs/tools-tab.component.js";

const e = React.createElement;

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = menuStore.getState();
        menuStore.subscribe(newState => this.setState(newState));
    }

    render() {
        const {
            selectedAlias
        } = this.state;

        const {
            colors,
            general,
            hotkeys,
            tools
        } = menuConst.aliases;

        let SelectedTab = null;
        if (selectedAlias === colors) {
            SelectedTab = ColorsTab;
        } else if (selectedAlias === general) {
            SelectedTab = GeneralTab;
        } else if (selectedAlias === hotkeys) {
            SelectedTab = HotkeysTab;
        } else if (selectedAlias === tools) {
            SelectedTab = ToolsTab;
        }

        return e(
            'main', {
                className: 'zuik zuik__main'
            },
            e(SelectedTab)
        );
    }
}