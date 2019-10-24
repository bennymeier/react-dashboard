import React, { Component, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withFirebase } from '../Firebase';
import { Header, Table, Icon, Popup, Modal, Button, Form, Loader } from 'semantic-ui-react';
const ModalAddDomain = props => {
    const { open, closeModalFn, saveModalFn } = props;
    const [entryDate, setEntryDate] = useState(new Date());
    const [userInput, setUserInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            firstname: '',
            lastname: '',
            phonenumber: '',
            gender: 'Male',
            about: '',
            email: '',
            entrydate: `${entryDate}`
        }
    );

    const handleChange = evt => {
        const { name, value } = evt.target;
        setUserInput({ [name]: value });
    }
    return (
        <Modal open={open}>
            <Header icon="add" content="Add Customer" />
            <Modal.Content>
                <>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input fluid label='First name' name="firstname" onChange={handleChange} placeholder='First name' autoFocus />
                            <Form.Input fluid label='Last name' name="lastname" onChange={handleChange} placeholder='Last name' />
                            <Form.Field label='Gender' control='select' onChange={handleChange} name="gender">
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Other'>Other</option>
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input fluid label='Phone Number' name="phonenumber" onChange={handleChange} placeholder='Phone Number' />
                            <Form.Input fluid label='E-Mail' name="email" onChange={handleChange} placeholder='E-Mail' />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.TextArea label='About' name="about" onChange={handleChange} placeholder='Some more information about the customer...' />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <div className="field">
                                <label>Entry date</label>
                                <div className="ui fluid input">
                                    <DatePicker selected={entryDate} onChange={setEntryDate} name="entrydate" />
                                </div>
                            </div>
                        </Form.Group>
                    </Form>
                </>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => closeModalFn()}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" onClick={() => saveModalFn(userInput)}>
                    <Icon name="checkmark" /> Save
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
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
    addCustomer = (user) => {
        this.props.firebase.customers().push({
            ...user,
            createdAt: this.props.firebase.serverValue.TIMESTAMP,
        });
        this.setState({ showModal: false });
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

    openModal = () => this.setState({ showModal: true });

    closeModal = () => this.setState({ showModal: false });

    deleteCustomer = uid => {
        this.props.firebase.customer(uid).remove();
        const deleteCustomer = this.state.customers.filter(customer => customer.uid !== uid);
        this.setState({ customers: deleteCustomer });
    };

    render() {
        const { customers, loading, showModal } = this.state;

        return (
            <>
                <Loader size="big" active={loading}>Loading</Loader>
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
                                <Table.Row key={c.uid}>
                                    <Table.Cell>{i + 1}</Table.Cell>
                                    <Table.Cell>
                                        {c.lastname}, {c.firstname}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Popup
                                            trigger={
                                                <Button basic compact circular icon as={Link} to={`/customer/${c.uid}`}>
                                                    <Icon name='save outline' color="green" />
                                                </Button>
                                            }
                                            content="Update"
                                            position="top center"
                                        />
                                        <Popup
                                            trigger={
                                                <Button basic compact circular icon onClick={() => this.deleteCustomer(c.uid)}>
                                                    <Icon
                                                        name="trash alternate outline"
                                                        color="red"
                                                    />
                                                </Button>
                                            }
                                            content="Delete"
                                            position="top center"
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
                {showModal && (
                    <ModalAddDomain open={showModal} closeModalFn={this.closeModal} saveModalFn={this.addCustomer} />
                )}
                <Button color="green" onClick={this.openModal}>
                    <Icon name="add" /> Add Customer
                </Button>
            </>
        );
    }
}

export default withFirebase(CustomersList);
