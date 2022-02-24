const e = React.createElement;

const buttonClassName = {
    main: 'zuik-button',
    second: 'zuik-button zuik-button__second',
    link: 'zuik-button zuik-button__link'
}

export class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            children,
            onClick = _ => false,
            buttonType = 'main',
        } = this.props;

        const className = buttonClassName[buttonType];
        return e(
            'button', {
                className,
                onClick
            },
            children
        );
    }
}