import {
    Row
} from "../elements/row.component.js";
import {
    Col
} from "../elements/col.component.js";
import {
    Group
} from "../elements/group.component.js";

import {
    Button
} from "../elements/button.component.js";

import {
    Color
} from "../elements/color.settings-component.js";
import {
    Hotkey
} from "../elements/hotkey.settings-component.js";
import {
    Range
} from "../elements/range.settings-component.js";
import {
    Select
} from "../elements/select.settings-component.js";
import {
    Switcher
} from "../elements/switch.settings-component.js";
import {
    SettingLine
} from "../elements/setting-line.component.js";
import {
    menuConst
} from '../../constants/menu.const.js';
import {
    menuStore
} from "../../stores/menu.store.js";
const e = React.createElement;

export class GeneralTab extends React.Component {
    constructor(props) {
        super(props);

        this.switchTabToHotkeys = this.switchTabToHotkeys.bind(this);
        this.switchTabToColors = this.switchTabToColors.bind(this);
    }

    switchTabToHotkeys() {
        menuStore.updateState({
            selectedAlias: menuConst.aliases.hotkeys
        })
    }

    switchTabToColors() {
        menuStore.updateState({
            selectedAlias: menuConst.aliases.colors
        })
    }

    render() {
        const {
            isLin,
            isMac,
            isWin
        } = window.api.platform;

        return e(
            React.Fragment,
            null,
            e(Group, null,
                e(Row, null,
                    e(Col, {
                            className: 'text-center zuik-h3'
                        },
                        `Znyatok v1.9.0`
                    )),
                e(
                    SettingLine, {
                        label: 'Start with system',
                        isHidden: isLin
                    },
                    e(Switcher, {
                        settingName: 'start-with-system'
                    })
                ),
                e(
                    SettingLine, {
                        label: 'Shoot only screen under mouse',
                        isHidden: true // TODO:
                    },
                    e(Switcher, {
                        settingName: 'shot-only-active-screen'
                    })
                ),
                e(
                    SettingLine, {
                        label: 'Tray icon type',
                        isHidden: isMac
                    },
                    e(Select, {
                        settingName: 'tray-icon-type'
                    })
                ),
                e(
                    SettingLine, {
                        label: 'Shot on PrintScreen',
                        isHidden: isLin
                    },
                    e(Switcher, {
                        settingName: 'shot-on-prnt-scr'
                    })
                ),
                e(
                    SettingLine, {
                        label: 'Take a screenshot hotkey'
                    },
                    e(Hotkey, {
                        hotkeyLabel: 'Take a screenshot',
                        settingName: 'hotkey-screenshot',
                        settingGroupName: 'schema-hotkeys'
                    })
                ),

            ),
            e(Group, null,
                e(
                    SettingLine, {
                        label: 'Hotkeys list'
                    },
                    e(Select, {
                        settingName: 'schema-hotkeys'
                    }),
                    e(Col, {
                            size: 12
                        },
                        e(Button, {
                                buttonType: 'link',
                                onClick: this.switchTabToHotkeys
                            },
                            'Customize Hotkeys'
                        )
                    )
                ),
                e(
                    SettingLine, {
                        label: 'Colors list'
                    },
                    e(Select, {
                        settingName: 'schema-colors'
                    }),
                    e(Col, {
                            size: 12
                        },
                        e(Button, {
                                buttonType: 'link',
                                onClick: this.switchTabToColors
                            },
                            'Customize colors'
                        )
                    )
                ),
            )
        );
    }
}