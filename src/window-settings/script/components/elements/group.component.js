const e = React.createElement;

export class Group extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            children,
            className = ''
        } = this.props;

        const content = typeof children === 'string' ?
            e('p', null, children) :
            children;

        const classNameArr = className.split(' ');
        classNameArr.push('zuik-group')

        return e(
            'div', {
                className: classNameArr.join(' '),
            },
            content
        );
    }
}