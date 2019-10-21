import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { Loader, Table, Icon, Popup, Button } from 'semantic-ui-react';

class CustomersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showModal: false,
            customers: [],
        };
    }
    componentDidMount() {
        this.loadCustomers();
    }
    componentWillUnmount() {
        this.props.firebase.customers().off();
    }

    loadCustomers = () => {
        this.setState({ loading: true });
        this.props.firebase
            .customers()
            .orderByChild('createdAt')
            .on('value', snapshot => {
                const customersObject = snapshot.val();
                if (customersObject) {
                    const customersList = Object.keys(customersObject).map(key => ({
                        ...customersObject[key],
                        uid: key,
                    }));

                    this.setState({
                        customers: customersList,
                        loading: false,
                    });
                } else {
                    this.setState({ customersList: [], loading: false });
                }
            });
    };

    deleteCustomer = uid => {
        this.props.firebase.customer(uid).remove();
    };

    render() {
        const { customers, loading } = this.state;

        return (
            <>
                {loading ? (
                    <Loader active inline />
                ) : (
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {customers &&
                                customers.map((c, i) => (
                                    <Table.Row key={d.uid}>
                                        <Table.Cell>{i + 1}</Table.Cell>
                                        <Table.Cell>
                                            {c.nachname}, {c.vorname}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Popup
                                                trigger={
                                                    <Icon
                                                        name="save outline"
                                                        color="green"
                                                        onClick={() => console.log('Update customer')}
                                                    />
                                                }
                                                content="Update"
                                                position="top center"
                                            />
                                            <Popup
                                                trigger={
                                                    <Icon
                                                        name="trash alternate outline"
                                                        color="red"
                                                        onClick={() => this.deleteCustomer(c.uid)}
                                                    />
                                                }
                                                content="Delete"
                                                position="top center"
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                )}
                <Button color="green" onClick={() => console.log('Add customer')}>
                    <Icon name="add" /> Add Customer
                </Button>
            </>
        );
    }
}

export default withFirebase(CustomersList);
