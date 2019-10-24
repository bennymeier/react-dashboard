import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import DomainsPage from '../Domains';
import CustomersPage from "../Customers";
import { Container } from "semantic-ui-react";
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import CustomerDetails from '../Customers/CustomerDetails';
import NavBar from "../Navigation/Navbar";
import TodosPage from "../Todos/TodosPage";

const App = () => (
  <Router>
    <div>
      <NavBar>
        <Container>
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.DOMAINS} component={DomainsPage} />
          <Route path={ROUTES.CUSTOMERS} component={CustomersPage} />
          <Route path={ROUTES.CUSTOMER_DETAILS} component={CustomerDetails} />
          <Route path={ROUTES.TODOS} component={TodosPage} />
        </Container>
      </NavBar>
    </div>
  </Router>
);

export default withAuthentication(App);
