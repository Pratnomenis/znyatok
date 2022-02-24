const e = React.createElement;

export class Col extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            className = '',
                children,
                size
        } = this.props;

        const content = typeof children === 'string' ?
            e('p', null, children) :
            children;

        const classNameArr = className.split(' ');
        classNameArr.push(size ? `zuik-col-${size}` : 'zuik-col')

        return e(
            'div', {
                className: classNameArr.join(' ')
            },
            content
        );
    }
}