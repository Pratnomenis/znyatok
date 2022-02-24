import {
    MenuList
} from "./menu-list.component.js";
const e = React.createElement;

export class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            'header', {
                className: 'zuik zuik__header'
            },
            e(MenuList)
        );
    }
}