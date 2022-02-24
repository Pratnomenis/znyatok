import {
    settingsStore
} from "./stores/settings.store.js";

export class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = settingsStore.getState();

        this.updateState = this.updateState.bind(this);
        this.updateStoreState = this.updateStoreState.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    componentDidMount() {
        settingsStore.subscribe(this.updateState);
    }

    componentWillUnmount() {
        settingsStore.unsubscribe(this.updateState);
    }

    updateState(newState) {
        this.setState(newState)
    }

    updateStoreState(newState) {
        settingsStore.updateState(newState);
    }

    onChange(event) {
        const {
            value
        } = event.target;

        this.setValue(value);
    }

    setValue(value) {
        const {
            settingName,
            settingGroupName
        } = this.props;

        let groupState = {};
        if (settingGroupName) {
            window.api.setSetting(settingGroupName, 'custom');
            groupState[settingGroupName] = 'custom';
        }

        this.updateStoreState({
            [settingName]: value,
            ...groupState
        });

        window.api.setSetting(settingName, value);
    }

    getValue() {
        const {
            settingName
        } = this.props;
        return this.state[settingName];
    }
}