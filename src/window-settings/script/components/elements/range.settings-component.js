import { SettingsComponent } from "../../settings-component.js";

const e = React.createElement;

export class Range extends SettingsComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            min = 0, max = 100, step = 1, dataMark
        } = this.props;
        
        const value = this.getValue(); // TODO

        return e(
            'input', {
                type: 'range',
                className: 'zuik-range',
                onChange: this.onChange,
                'data-mark': dataMark,
                min,
                max,
                step,
                value
            }
        );
    }
}