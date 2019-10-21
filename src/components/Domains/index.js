import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import DomainsList from './DomainsList';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

import { Header } from 'semantic-ui-react';
const DomainsPage = () => (
    <div>
        <Header as="h2">Domains</Header>
        <Switch>
            <Route exact path={ROUTES.DOMAINS} component={DomainsList} />
        </Switch>
    </div>
);

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    withEmailVerification,
    withAuthorization(condition)
)(DomainsPage);
