import React from 'react';
import { Form, Button, Input, Segment, Loader, Container } from 'semantic-ui-react';
import * as utils from '../utils.js';

export default class ConfForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingData: true,
            warningMessage: null,
            element: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch(localStorage.getItem('url') + 'configurations/1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            }
        }).then((res) => res.json())
            .then((r) => {
                this.setState({ loadingData: false, element:r.data});
            })
    }

    handleSubmit() {
        let { element } = this.state;
        this.setState({ loading: true });
        fetch(localStorage.getItem('url') + 'configurations', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            },
            body: JSON.stringify(element)
        }).then((res) => res.json())
            .then((r) => {
                this.setState({ loading: false });
                utils.evalResponse(r, null, 'Configuración actualizada.');
            })
    }


    render() {
        if (this.state.loadingData) {
            return (
                <Container text >
                    <Segment inverted style={{ 'min-height': '400px' }}>
                        <Loader active size='big'>Cargando...</Loader>
                    </Segment>
                </Container>
            )
        }
        return (
            <Container text >
                <Segment>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field control={Input} required label='Limite de cantidad de prendas por line de pedido:'
                            type='number' placeholder='Número límite'
                            step='1'
                            max='999'
                            min='1'
                            value={this.state.element.maxGarmentPerLine}
                            onChange={(evt) => {
                                let { element } = this.state;
                                element.maxGarmentPerLine = evt.target.value;
                                this.setState({ element });
                            }}
                        >
                        </Form.Field>
                        <Form.Field control={Input} required label='Limite de monto total de venta:'
                            type='number' placeholder='Número límite'
                            step='0.01'
                            max='99999.99'
                            min='1'
                            value={this.state.element.maxAmountPerPurchase}
                            onChange={(evt) => {
                                let { element } = this.state;
                                element.maxAmountPerPurchase = evt.target.value;
                                this.setState({ element });
                            }}
                        >
                        </Form.Field>
                        <br></br>
                        <Button color='blue'
                            loading={this.state.loading}
                            type={this.state.loading ? 'button' : 'submit'}>
                            Actualizar
                    </Button>
                    </Form>
                </Segment>
            </Container>
        );
    }

}