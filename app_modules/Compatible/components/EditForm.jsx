import React from 'react';
import { Card, Form, Button, Input, Message, Loader, Segment } from 'semantic-ui-react';
import * as utils from '../../../utils.js';
import FileUploader from '../../FileUploader.jsx';

export default class EntityEditForm extends React.Component {

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
        fetch(localStorage.getItem("url") + 'compatibleGarments/' + this.props.entity.id, {
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
        let { element } = this.state;

        if (element.previewImage == '') {
            this.setState({ warningMessage: 'Debe proporcionar una imagen de previzualización' })
            return;
        }
        if (element.image == '') {
            this.setState({ warningMessage: 'Debe proporcionar una imagen de tamaño completo' })
            return;
        }

        this.setState({ loading: true });
        fetch(localStorage.getItem('url') + 'compatibleGarments', {
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
                }, 'Prenda compatible editada con éxito.');
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
        let preImageRoute = localStorage.getItem('url') + 'utilities/getFile/' + this.state.element.previewImage;
        let imageRoute = localStorage.getItem('url') + 'utilities/getFile/' + this.state.element.image;
        return (
            <div>
                {this.renderWarningMessage()}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field control={Input} required label='Nombre:'
                        type='text' placeholder='Nombre de la prenda compatible...' maxLength='50'
                        value={this.state.element.name}
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.name = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>
                    <Form.Field control={Input} required label='Descripción:'
                        type='text' placeholder='Descripción de la prenda compatible...' maxLength='50'
                        value={this.state.element.description}
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.description = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>
                    <Form.Field control={Input} required
                        label='Precio:' type='number' placeholder='Precio de la prenda compatible...'
                        value={this.state.element.price}
                        min='1' max='9999' step='0.01'
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.price = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>
                    <label>Foto previsualización:</label>
                    <Card image={preImageRoute} />                       
                    <FileUploader uploaded={(fileName) => {
                        let { element } = this.state;
                        element.previewImage = fileName;
                        this.setState({ element });
                    }} />
                    <label>Foto grande:</label>
                    <Card image={imageRoute} />                    
                    <FileUploader uploaded={(fileName) => {
                        let { element } = this.state;
                        element.image = fileName;
                        this.setState({ element });
                    }} />
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