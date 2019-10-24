import React from 'react';
import { Container, Icon, Menu, Sidebar, Image, Responsive } from 'semantic-ui-react';
import Navigation from "../Navigation/index";
const NavBarMobile = ({
    children,
    onPusherClick,
    onToggle,
    visible
}) => (
        <Sidebar.Pushable>
            <Sidebar
                as={Menu}
                animation="overlay"
                icon="labeled"
                inverted
                vertical
                visible={visible}
            >
                <Navigation />
            </Sidebar>
            <Sidebar.Pusher
                dimmed={visible}
                onClick={onPusherClick}
                style={{ minHeight: "100vh" }}
            >
                <Menu fixed="top" inverted>
                    <Menu.Item>
                        <Image size="tiny" src="https://www.bennymeier-media.de/img/logo_white.png" />
                    </Menu.Item>
                    <Menu.Item onClick={onToggle}>
                        <Icon name="sidebar" />
                    </Menu.Item>black
                    <Menu.Menu position="right">
                        <Menu.Item name="Logout" />
                    </Menu.Menu>
                </Menu>
                {children}
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );

const NavBarDesktop = () => (
    <Menu fixed="top" inverted>
        <Menu.Item>
            <Image width="100" src="https://www.bennymeier-media.de/img/logo_white.png" />
        </Menu.Item>
        <Navigation />
    </Menu>
);

const NavBarChildren = ({ children }) => (
    <Container style={{ marginTop: "5em" }}>{children}</Container>
);

export default class NavBar extends React.Component {
    state = {
        visible: false
    };

    handlePusher = () => {
        const { visible } = this.state;

        if (visible) this.setState({ visible: false });
    };

    handleToggle = () => this.setState({ visible: !this.state.visible });

    render() {
        const { children } = this.props;
        const { visible } = this.state;
        return (
            <div>
                <Responsive {...Responsive.onlyMobile}>
                    <NavBarMobile
                        onPusherClick={this.handlePusher}
                        onToggle={this.handleToggle}
                        visible={visible}
                    >
                        <NavBarChildren>{children}</NavBarChildren>
                    </NavBarMobile>
                </Responsive>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <NavBarDesktop />
                    <NavBarChildren>{children}</NavBarChildren>
                </Responsive>
            </div>
        );
    }
};