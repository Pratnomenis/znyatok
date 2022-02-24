const e = React.createElement;

export class Row extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            children
        } = this.props;

        const content = typeof children === 'string' ?
            e('p', null, children) :
            children;

        return e(
            'section', {
                className: 'zuik-row'
            },
            content
        );
    }
}