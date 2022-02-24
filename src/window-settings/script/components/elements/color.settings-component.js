import { SettingsComponent } from "../../settings-component.js";

const e = React.createElement;

export class Color extends SettingsComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const value = this.getValue();

        return e(
            'input', {
                type: 'color',
                className: 'zuik-color',
                onChange: this.onChange,
                value
            }
        );
    }
}