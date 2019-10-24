import React from 'react'
import { Dimmer, Header, Icon } from 'semantic-ui-react'

export default props => {
    return (
        <Dimmer active={props.active} page>
            <Header as='h1' icon inverted>
                <Icon name='lab' loading />
                Loading
            <Header.Subheader>We're fetching data from Firebase, please be patient.</Header.Subheader>
            </Header>
        </Dimmer>
    )
};