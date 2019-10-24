import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { Container, Menu, Dropdown, Icon } from 'semantic-ui-react';

const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser => (authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
    <>
        <Menu.Item name="Landing" as={Link} to={ROUTES.LANDING} />
        <Menu.Item name="Home" as={Link} to={ROUTES.HOME} />
        <Menu.Item name="Account" as={Link} to={ROUTES.ACCOUNT} />
        {
            !!authUser.roles[ROLES.ADMIN] && (
                <>
                    <Menu.Item name="Admin" as={Link} to={ROUTES.ADMIN} />
                    <Menu.Item name="Domains" as={Link} to={ROUTES.DOMAINS} />
                    <Menu.Item name="Customers" as={Link} to={ROUTES.CUSTOMERS} />
                    <Dropdown text='Todos' pointing className='link item'>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={ROUTES.TODOS}><Icon name="tasks" />All</Dropdown.Item>
                            <Dropdown.Item><Icon name="add" />Add</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item><Icon name="delete" />Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </>
            )
        }
        <SignOutButton />
    </>
);

const NavigationNonAuth = () => (
    <Menu pointing secondary>
        <Container>
            <Menu.Item name="home" as={Link} to={ROUTES.LANDING} />
            <Menu.Menu position="right">
                <Menu.Item name="signin" as={Link} to={ROUTES.SIGN_IN} />
            </Menu.Menu>
        </Container>
    </Menu>
);

export default Navigation;
