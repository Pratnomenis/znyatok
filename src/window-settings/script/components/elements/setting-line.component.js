import {
    Row
} from "./row.component.js";
import {
    Col
} from "./col.component.js";

const e = React.createElement;

export class SettingLine extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            label,
            children,
            isHidden = false
        } = this.props;

        if (isHidden) {
            return null;
        }

        const content = typeof children === 'string' ?
            e('p', null, children) :
            children;

        return e(
            Row,
            null,
            e(
                Col,
                null,
                label
            ),
            e(
                Col, {
                    className: 'text-right'
                },
                content
            ),
        );
    }
}