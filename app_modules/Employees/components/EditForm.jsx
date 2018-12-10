import React from 'react';
import { Form, Button, Input, Message, Segment, Loader} from 'semantic-ui-react';
import * as utils from '../../../utils.js';

export default class EntityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            warningMessage: null,
            element: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch(localStorage.getItem("url") + 'employees/' + this.props.entity.mail, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            },
        }).then((res) => res.json())
            .then((r) => {
                utils.evalResponse(r, () => {
                    this.setState({ element: r.data });                    
                });
            })
    }

    handleSubmit() {        
        this.setState({ loading: true });
        fetch(localStorage.getItem('url') + 'employees', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            },
            body: JSON.stringify(this.state.element)
        }).then((res) => res.json())
            .then((r) => {
                this.setState({ loading: false });
                utils.evalResponse(r, () => {
                    this.props.closeModal();
                    this.props.filter();
                }, 'Empleado editado con éxito.');
            })
    }

    renderWarningMessage() {
        if (this.state.warningMessage != null) {
            return (
                <Message warning attached='bottom'>
                    <h4>{this.state.warningMessage}</h4>
                </Message>
            )
        }
    }

    render() {
        if (this.state.element == null) {
            return (
                <Segment inverted style={{ 'min-height': '400px' }}>
                    <Loader active size='big'>Cargando...</Loader>
                </Segment>
            )
        }
        return (
            <div>
                {this.renderWarningMessage()}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field control={Input} required label='Alias:'
                        type='text' placeholder='Alias de empleado'
                        autoFocus type='name'
                        value={this.state.element.name}
                        maxLength='50'
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.name = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>
                    <Form.Field control={Input} required label='Nombre:'
                        type='text' placeholder='Nombre del empleado'
                        value={this.state.element.fullName}
                        maxLength='50'
                        onChange={(e) => {
                            let { element } = this.state;
                            element.fullName = e.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Field control={Input} required label='Teléfono:'
                            type='number'
                            step='1'
                            max='9999999999'
                            maxLength='10'
                            placeholder='Número telefónico del empleado a 10 digitos'
                            value={this.state.element.phone}
                            onChange={(e) => {
                                let { element } = this.state;
                                element.phone = e.target.value;
                                this.setState({ element });
                            }}
                        >
                        </Form.Field>                    
                    </Form.Group>
                    <Form.Field control={Input} required label='Correo:'
                        placeholder='Correo electrónico del empleado'
                        value={this.state.element.mail}
                        maxLength='150'
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.mail = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>                 
                    <br></br>
                    <Button color='green'
                        loading={this.state.loading}
                        type={this.state.loading ? 'button' : 'submit'}>
                        Editar
                    </Button>
                </Form>
            </div>
        );
    }

}