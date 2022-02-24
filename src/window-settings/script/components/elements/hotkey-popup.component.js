import {
    HotKeyConstructor
} from "../../helpers/hotkey.constructor.js";

const e = React.createElement;

export class HotkeyPopup extends React.Component {
    constructor(props) {
        super(props);

        this.keyDownListener = this.keyDownListener.bind(this);
        this.keyUpListener = this.keyUpListener.bind(this);

        this.removeHotKey = this.removeHotKey.bind(this);
        this.setHotKey = this.setHotKey.bind(this);
        this.cancelHotkeySetting = this.cancelHotkeySetting.bind(this);
        this.setValue = this.setValue.bind(this);

        this.state = {
            lastUpdate: Date.now() + Math.random()
        };

        this.hotKey = new HotKeyConstructor();
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDownListener);
        document.addEventListener('keyup', this.keyUpListener);

        window.api.onBlurActions.add(this.cancelHotkeySetting);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownListener);
        document.removeEventListener('keyup', this.keyUpListener);

        window.api.onBlurActions.remove(this.cancelHotkeySetting);
    }

    keyDownListener(event) {
        event.preventDefault();
        if (!this.hotKey.isExtraKeysPressed()) {
            if (event.code === 'Escape') {
                this.cancelHotkeySetting();
                return false;
            }

            if (event.code === 'Delete' || event.code === 'Backspace') {
                this.removeHotKey();
                return false;
            }
        }
        this.hotKey.switchOn(event);

        if (this.hotKey.isFullHotkey()) {
            this.setHotKey();
        } else {
            this.setState({
                ...this.state,
                lastUpdate: Date.now() + Math.random()
            });
        }

        return false;
    }

    keyUpListener(event) {
        event.preventDefault();
        this.hotKey.switchOff(event);
        this.setState({
            ...this.state,
            lastUpdate: Date.now() + Math.random()
        });

        return false;
    }

    removeHotKey() {
        this.setValue(null);
        this.props.closePopup();
    }

    setHotKey() {
        const newHotkey = this.hotKey.getResultForElectron();
        this.setValue(newHotkey);
        this.props.closePopup();
    }

    cancelHotkeySetting() {
        this.props.closePopup();
    }

    setValue(newValue) {
        this.props.setValue(newValue);
    }

    render() {
        const {
            hotkeyLabel = 'Set hotkey'
        } = this.props;
        // TODO: or old hotkey
        let currentHotkeyValue = this.hotKey.getResultForElectron();

        return e(
            'section', {
                className: 'popup-wrapper'
            },
            e(
                'section', {
                    className: 'popup'
                },
                e(
                    'h2', {
                        className: 'popup-header'
                    },
                    hotkeyLabel
                ),
                e(
                    'p', {
                        className: 'popup-value'
                    },
                    currentHotkeyValue
                ),
                e(
                    'p', {
                        className: 'popup-info'
                    },
                    'Del - remove hotkey'
                ),
                e(
                    'p', {
                        className: 'popup-info'
                    },
                    'Esc - cancel'
                )
            )
        );
    }
}