import React from 'react';
import {Segment} from 'semantic-ui-react';

export default class Password extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            collection: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(){

    }

    render() {
        return (
            <div>
                <Segment textAlign='center'>                                                            
                    <h3>Recuperar contraseña</h3>
                </Segment>

                <Segment textAlign='center'>
                    <Form onSubmit={this.handleSubmit}>

                    </Form>
                </Segment>
                
            </div>
        )
    }
}
