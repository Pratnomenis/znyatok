import {
    menuConst
} from '../constants/menu.const.js';

import {
    MenuListItem
} from './menu-list-item.component.js';

const e = React.createElement;

export class MenuList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            'div', {
                className: 'zuik-tab--list'
            },
            menuConst.list.map(item => e(
                MenuListItem, {
                    ...item,
                    key: item.alias
                }
            ))
        );
    }
}