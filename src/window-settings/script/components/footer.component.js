const e = React.createElement;

import {
    Row
} from "./elements/row.component.js";
import {
    Button
} from "./elements/button.component.js";
import {
    Col
} from "./elements/col.component.js";
import {
    settingsStore
} from "../stores/settings.store.js";

export class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.restoreDefaultSettings = this.restoreDefaultSettings.bind(this);
        this.closeSettings = this.closeSettings.bind(this);
    }

    restoreDefaultSettings() {
        const defaultSettings = window.api.getAllSettings().defaultSettings;
        Object
            .entries(defaultSettings)
            .forEach(([key, value]) => window.api.setSetting(key, value))
        settingsStore.updateState(defaultSettings);
    }

    closeSettings() {
        window.api.closeWindow();
    }

    render() {
        return e(
            'footer', {
                className: 'zuik zuik__footer'
            },
            e(Row, {},
                e(Col, {
                        className: 'text-right'
                    },
                    e(Button, {
                            buttonType: 'link',
                            onClick: this.restoreDefaultSettings
                        },
                        'Restore default settings'
                    ),
                    e(Button, {
                            onClick: this.closeSettings
                        },
                        'Done'
                    )
                )
            )
        );
    }
}