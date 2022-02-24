const e = React.createElement;

import {
    menuStore
} from '../stores/menu.store.js';

export class MenuListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = menuStore.getState();
        menuStore.subscribe(newState => this.setState(newState));
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const {
            alias
        } = this.props;

        menuStore.updateState({
            selectedAlias: alias
        });
    }

    render() {
        const {
            alias,
            label
        } = this.props;
        let className = 'zuik-tab--item';

        if (this.state.selectedAlias === alias) {
            className += ' zuik-tab--item__active'
        }

        return e(
            'button', {
                className,
                onClick: this.onClick
            },
            label
        );
    }
}