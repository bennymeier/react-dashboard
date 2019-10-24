import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form, Icon } from 'semantic-ui-react';
import Dimmer from "../Helper/Dimmer";
class CustomerDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            customer: null,
            entryDate: new Date(),
            ...props.location.state,
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        const uid = this.props.match.params.id;
        this.props.firebase.customer(uid).on('value', snapshot => {
            if (!snapshot.val()) {
                this.props.history.push('/customers');
            } else {
                this.setState({
                    customer: { uid, ...snapshot.val() },
                    loading: false,
                });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.customer(this.props.match.params.id).off();
    }

    handleChange = evt => {
        const { name, value } = evt.target;
        this.setState({
            customer: {
                ...this.state.customer,
                [name]: value
            }
        });
    };

    setEntryDate = (date) => {
        this.setState({ entryDate: date });
    };

    updateCostumer = async () => {
        const { customer: c, entryDate } = this.state;
        await this.props.firebase.customer(c.uid).update({
            ...c,
            entryDate: entryDate,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
        this.props.history.push('/customers');
    };

    deleteCustomer = uid => {
        this.props.firebase.customer(uid).remove();
    };
    render() {
        const { customer, loading, entryDate } = this.state;
        return (
            <>
                <Dimmer active={loading} />
                {customer && customer.uid &&
                    (
                        <Form>
                            <Form.Input fluid label='Uid' name="uid" value={customer.uid} disabled />
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='First name' name="firstname" onChange={this.handleChange} value={customer.firstname} placeholder='First name' autoFocus />
                                <Form.Input fluid label='Last name' name="lastname" onChange={this.handleChange} value={customer.lastname} placeholder='Last name' />
                                <Form.Field label='Gender' control='select' onChange={this.handleChange} value={customer.gender} name="gender">
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                    <option value='Other'>Other</option>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='Phone Number' name="phonenumber" onChange={this.handleChange} value={customer.phonenumber} placeholder='Phone Number' />
                                <Form.Input fluid label='E-Mail' name="email" onChange={this.handleChange} value={customer.email} placeholder='E-Mail' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.TextArea label='About' name="about" onChange={this.handleChange} value={customer.about} placeholder='Some more information about the customer...' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <div className="field">
                                    <label>Entry date</label>
                                    <div className="ui fluid input">
                                        <DatePicker selected={entryDate} onChange={date => this.setEntryDate(date)} name="entrydate" />
                                    </div>
                                </div>
                            </Form.Group>
                            <Button color="green" onClick={this.updateCostumer}>
                                <Icon name="checkmark" /> Update
                            </Button>
                        </Form>
                    )}
            </>
        );
    }
}
export default withFirebase(CustomerDetails);
