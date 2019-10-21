import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { Card, Loader, Button } from 'semantic-ui-react';

class CustomerDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            customer: null,
            ...props.location.state,
        };
    }

    componentDidMount() {
        if (this.state.customer) {
            return;
        }

        this.setState({ loading: true });

        this.props.firebase.customer(this.props.match.params.id).on('value', snapshot => {
            this.setState({
                customer: snapshot.val(),
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.customer(this.props.match.params.id).off();
    }

    deleteCustomer = uid => {
        this.props.firebase.customer(uid).remove();
    };
    render() {
        const { customer, loading } = this.state;

        return (
            <Card fluid={true}>
                {loading ? (
                    <Loader active inline="centered" />
                ) : (
                    <Card.Content>
                        <Card.Header>User: {customer.uid}</Card.Header>
                        <Card.Description>
                            {customer && (
                                <div>
                                    <Card.Content>
                                        <Card.Meta>
                                            <span>Username: {customer.username}</span>
                                        </Card.Meta>
                                        <Card.Description>{customer.email}</Card.Description>
                                        <br />
                                        <Button type="button" onClick={this.deleteCustomer}>
                                            Delete
                                        </Button>
                                    </Card.Content>
                                </div>
                            )}
                        </Card.Description>
                    </Card.Content>
                )}
            </Card>
        );
    }
}

export default withFirebase(CustomerDetails);
