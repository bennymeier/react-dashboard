import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import CustomersList from './CustomersList';
import CustomerDetails from './CustomerDetails';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

import { Header } from 'semantic-ui-react';
const CustomersPage = () => (
    <div>
        <Header as="h2">Customers</Header>
        <Switch>
            <Route exact path={ROUTES.CUSTOMER_DETAILS} component={CustomerDetails} />
            <Route exact path={ROUTES.CUSTOMERS} component={CustomersList} />
        </Switch>
    </div>
);

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    withEmailVerification,
    withAuthorization(condition)
)(CustomersPage);
