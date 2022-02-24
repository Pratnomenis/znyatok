import {
    SettingsComponent
} from "../../settings-component.js";
import {
    Button
} from "./button.component.js";
import {
    HotkeyPopup
} from "./hotkey-popup.component.js";

const e = React.createElement;

export class Hotkey extends SettingsComponent {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            isPopupOpen: false
        }

        this.switchPopup = this.switchPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
    }

    switchPopup() {
        this.setState({
            ...this.state,
            isPopupOpen: !this.state.isPopupOpen
        })
    }

    closePopup() {
        this.setState({
            ...this.state,
            isPopupOpen: false
        })
    }

    render() {
        const value = this.getValue() || '<empty>';
        const {
            hotkeyLabel
        } = this.props;
        const popup = this.state.isPopupOpen ? e(HotkeyPopup, {
            hotkeyLabel,
            setValue: this.setValue,
            closePopup: this.closePopup
        }, null) : null;

        return e(
            Button, {
                buttonType: 'second',
                onClick: this.switchPopup,
            },
            value,
            popup
        );
    }
}