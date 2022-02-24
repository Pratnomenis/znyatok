import {
    SettingsComponent
} from "../../settings-component.js";

const e = React.createElement;

export class Select extends SettingsComponent {
    constructor(props) {
        super(props);

        this.getOnChange = this.getOnChange.bind(this);
    }

    getOnChange(options) {
        const keyList = options.at(-1).keyList;
        const {
            settingName
        } = this.props;

        return event => {
            const {
                value
            } = event.target;
        
            if (value !== 'custom' && keyList) {
                let savedSettings = {};
                keyList.forEach(key => {
                    savedSettings[key] = this.state[key];
                });
                options.at(-1).valueList = savedSettings;
            }
            window.api.setSetting(settingName, value);
        
            const {
                valueList = {}
            } = options.find(el => el.value === value);
            if (valueList) {
                for (let key in valueList) {
                    window.api.setSetting(key, valueList[key]);
                }
            }

            this.updateStoreState({
                [settingName]: value,
                ...valueList
            });
        };
    }

    render() {
        const value = this.getValue();
        const {
            optionsName = this.props.settingName + '_options'
        } = this.props;

        const options = this.state[optionsName] || [value];

        return e(
            'select', {
                className: 'zuik-select',
                onChange: this.getOnChange(options),
                value,
            },
            options.map(({
                value,
                label
            }) => e(
                'option', {
                    key: value,
                    value
                },
                label
            ))
        );
    }
}