import {
    SettingsComponent
} from "../../settings-component.js";

const e = React.createElement;

export class Switcher extends SettingsComponent {
    constructor(props) {
        super(props);
        this.switcherOnChange = this.switcherOnChange.bind(this);
    }

    switcherOnChange(event) {
        const {
            checked
        } = event.target;
        
        this.onChange({
            target: {
                value: checked
            }
        })
    }

    render() {
        const value = this.getValue();

        return e('input', {
            type: 'checkbox',
            className: 'zuik-switch',
            onChange: this.switcherOnChange,
            checked: value
        });
    }
}