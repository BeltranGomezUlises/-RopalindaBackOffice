import React from 'react';
import { Form, Button, Input, Message, Divider} from 'semantic-ui-react';
import * as utils from '../../../utils.js';

export default class EntityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            warningMessage: null,
            fullName: {
                firstName: '',
                fatherLastName: '',
                motherLastName: '',
            },
            element: {
                name: '',
                mail: '',
                pass: '',
                fullName: '',
                phone:'',
                employeeType: '1',
            },
            confirm: '',
            message: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let pass = this.state.element.pass;
        let confirm = this.state.confirm;
        let firstName = this.state.fullName.firstName;
        let fatherLastName = this.state.fullName.fatherLastName;
        let motherLastName = this.state.fullName.motherLastName;
        let { element } = this.state;
        element.fullName = firstName + ' ' + fatherLastName + ' ' + motherLastName;
        this.setState({element})
        this.setState({ message: '' })
        if (pass !== confirm) {
            this.setState({ message: 'Contraseña y su confirmación deben ser iguales' })
            return;
        }
        if (this.state.message === '') {
            this.setState({ loading: true, message: '' });
            fetch(localStorage.getItem('url') + 'employees', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
              },
              body: JSON.stringify(this.state.element)
            }).then((res) => res.json())
              .then((response) => {
                this.setState({ loading: false });
                utils.evalResponse(response, () => {
                  let activing = true;
                  let activingToken = response.data;
                  this.setState({
                    activing,
                    activingToken
                  });
                  this.props.closeModal();
                  this.props.filter();
                }, 'Empleado registrado con éxito.');
              })
          }

        this.setState({ loading: true });
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
                    <Divider horizontal>Nombre completo</Divider>
                    <Form.Group widths='equal'>
                        <Form.Field control={Input} required label='Nombre:'
                            type='text' placeholder='Nombre del empleado'
                            value={this.state.fullName.firstName}
                            maxLength='50'
                            onChange={(evt) => {
                                let { fullName } = this.state;
                                fullName.firstName = evt.target.value;
                                this.setState({ fullName });
                            }}
                        >
                        </Form.Field>
                        <Form.Field control={Input} required label='Apellido paterno:'
                            type='text' placeholder='Apellido paterno del empleado'
                            value={this.state.fullName.fatherLastName}
                            maxLength='50'
                            onChange={(evt) => {
                                let { fullName } = this.state;
                                fullName.fatherLastName = evt.target.value;
                                this.setState({ fullName });
                            }}
                        >
                        </Form.Field>
                        <Form.Field control={Input} required label='Apellido materno:'
                            type='text' placeholder='Apellido materno del empleado'
                            value={this.state.fullName.motherLastName}
                            maxLength='50'
                            onChange={(e) => {
                                let { fullName } = this.state;
                                fullName.motherLastName = e.target.value;
                                this.setState({ fullName });
                            }}
                        >
                        </Form.Field>
                    </Form.Group>
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
                    <Form.Field control={Input} label='Contraseña:'
                        required type='password' autoComplete='off'
                        placeholder='Ingrese su contraseña'
                        onChange={(e) => {
                            let { element } = this.state;
                            element.pass = e.target.value;
                            this.setState({ element });
                        }}>
                    </Form.Field>
                    <Form.Field control={Input} label='Confirmación de contraseña:'
                        required type='password' autoComplete='off'
                        placeholder='Ingrese de nuevo su contraseña'
                        onChange={(e) => {
                            this.setState({ confirm: e.target.value })
                        }}>
                    </Form.Field>             
                    <br></br>
                    <Button color='green'
                        loading={this.state.loading}
                        type={this.state.loading ? 'button' : 'submit'}>
                        Agregar
                    </Button>
                </Form>
            </div>
        );
    }

}