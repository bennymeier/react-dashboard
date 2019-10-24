import React, { Component, useState } from 'react';
import { withFirebase } from '../Firebase';
import { Header, Table, Icon, Popup, Modal, Button, Input, Loader } from 'semantic-ui-react';

const ModalUpdateDomain = props => {
    const { closeModalFn, domain: currentDomain, saveModalFn, open, uid } = props;
    const [domain, setDomain] = useState(currentDomain);
    return (
        <Modal open={open}>
            <Header icon="save outline" content={`Update ${currentDomain}`} />
            <Modal.Content>
                <Input
                    label="https://"
                    placeholder="mysite.com"
                    fluid
                    onChange={e => setDomain(e.currentTarget.value)}
                    value={domain}
                    autoFocus
                />
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => closeModalFn()}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" onClick={() => saveModalFn(uid, domain)}>
                    <Icon name="checkmark" /> Save
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

const ModalAddDomain = props => {
    const { open, closeModalFn, saveModalFn } = props;
    const [domain, setDomain] = useState('');
    return (
        <Modal open={open}>
            <Header icon="add" content="Add Domain" />
            <Modal.Content>
                <>
                    <Input
                        label="https://"
                        placeholder="mysite.com"
                        fluid
                        onChange={e => setDomain(e.currentTarget.value)}
                        value={domain}
                        autoFocus
                    />
                </>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => closeModalFn()}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" onClick={() => saveModalFn(domain)}>
                    <Icon name="checkmark" /> Save
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
class DomainsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showModal: false,
            mode: 'add',
            currentDomain: '',
            currentUid: '',
            domain: '',
            domains: [],
        };
    }
    componentDidMount() {
        this.loadDomains();
    }
    componentWillUnmount() {
        this.props.firebase.domains().off();
    }

    openModal = (mode, currentDomain, currentUid) => {
        this.setState({ showModal: true, mode, currentDomain, currentUid });
    };
    loadDomains = () => {
        this.setState({ loading: true });
        this.props.firebase
            .domains()
            .orderByChild('createdAt')
            .on('value', snapshot => {
                const domainsObject = snapshot.val();
                if (domainsObject) {
                    const domainsList = Object.keys(domainsObject).map(key => ({
                        ...domainsObject[key],
                        uid: key,
                    }));

                    this.setState({
                        domains: domainsList,
                        loading: false,
                    });
                } else {
                    this.setState({ domains: [], loading: false });
                }
            });
    };
    closeModal = () => this.setState({ showModal: false });

    deleteDomain = uid => {
        this.props.firebase.domain(uid).remove();
    };

    updateDomain = async (uid, domain) => {
        await this.props.firebase.domain(uid).update({
            text: domain,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
        this.setState({ showModal: false });
    };

    addDomain = domain => {
        this.props.firebase.domains().push({
            text: domain,
            createdAt: this.props.firebase.serverValue.TIMESTAMP,
        });
        this.setState({ showModal: false });
    };
    render() {
        const { domains, loading, showModal, mode, currentDomain, currentUid } = this.state;

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
                        {domains.map((d, i) => (
                            <Table.Row key={d.uid}>
                                <Table.Cell>{i + 1}</Table.Cell>
                                <Table.Cell>{d.text}</Table.Cell>
                                <Table.Cell>
                                    <Popup
                                        trigger={
                                            <Button basic compact circular icon onClick={() => this.openModal('update', d.text, d.uid)}>
                                                <Icon
                                                    name="save outline"
                                                    color="green"
                                                />
                                            </Button>
                                        }
                                        content="Update"
                                        position="top center"
                                    />
                                    <Popup
                                        trigger={
                                            <Button basic compact circular icon onClick={() => this.deleteDomain(d.uid)}>
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
                <Button color="green" onClick={() => this.openModal('add')}>
                    <Icon name="add" /> Add Domain
                        </Button>
                {showModal && mode === 'add' && (
                    <ModalAddDomain open={showModal} closeModalFn={this.closeModal} saveModalFn={this.addDomain} />
                )}
                {showModal && mode === 'update' && (
                    <ModalUpdateDomain
                        open={showModal}
                        domain={currentDomain}
                        uid={currentUid}
                        closeModalFn={this.closeModal}
                        saveModalFn={this.updateDomain}
                    />
                )}
            </>
        );
    }
}

export default withFirebase(DomainsList);
