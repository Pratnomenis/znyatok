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

const e = React.createElement;

export class ColorsTab extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            React.Fragment,
            null,
            e(
                SettingLine, {
                    label: 'Colors list'
                },
                e(Select, {
                    settingName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #1'
                },
                e(Color, {
                    settingName: 'color-0',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #2'
                },
                e(Color, {
                    settingName: 'color-1',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #3'
                },
                e(Color, {
                    settingName: 'color-2',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #4'
                },
                e(Color, {
                    settingName: 'color-3',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #5'
                },
                e(Color, {
                    settingName: 'color-4',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #6'
                },
                e(Color, {
                    settingName: 'color-5',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #7'
                },
                e(Color, {
                    settingName: 'color-6',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #8'
                },
                e(Color, {
                    settingName: 'color-7',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #9'
                },
                e(Color, {
                    settingName: 'color-8',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #10'
                },
                e(Color, {
                    settingName: 'color-9',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #11'
                },
                e(Color, {
                    settingName: 'color-10',
                    settingGroupName: 'schema-colors'
                })
            ),
            e(
                SettingLine, {
                    label: 'Color #12'
                },
                e(Color, {
                    settingName: 'color-11',
                    settingGroupName: 'schema-colors'
                })
            ),

            e(
                SettingLine, {
                    label: 'Internal circle opacity'
                },
                e(Range, {
                    min: 20,
                    max: 80,
                    step: 10,
                    dataMark: '%',
                    settingName: 'color-opacity',
                    settingGroupName: 'schema-colors'
                })
            ),
        );
    }
}