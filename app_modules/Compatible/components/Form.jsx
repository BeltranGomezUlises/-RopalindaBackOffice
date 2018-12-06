import React from 'react';
import { Form, Button, Input, Message, Card } from 'semantic-ui-react';
import * as utils from '../../../utils.js';
import FileUploader from '../../FileUploader.jsx';

export default class EntityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            warningMessage: null,
            element: {
                price: 0.0,
                name: '',
                description: '',
                previewImage: '',
                image: ''
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let {element} = this.state;

        if(element.previewImage == ''){
            this.setState({warningMessage:'Debe proporcionar una imagen de previzualización'})
            return;
        }
        if(element.image == ''){
            this.setState({warningMessage:'Debe proporcionar una imagen de tamaño completo'})
            return;
        }


        this.setState({ loading: true });
        fetch(localStorage.getItem('url') + 'compatibleGarments', {
            method: 'POST',
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
                }, 'Prenda compatible agregada con éxito.');
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

    renderImage(imageName){
        if(imageName !== null && imageName !== ''){
            let route = localStorage.getItem('url') + 'utilities/getFile/' + imageName;
            return(
                <Card image={route} />
            )
        }
    }

    render() {        
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
                    {this.renderImage(this.state.element.previewImage)}
                    <FileUploader uploaded={(fileName) => {
                        let { element } = this.state;
                        element.previewImage = fileName;
                        this.setState({ element });
                    }} />
                    <label>Foto grande:</label>
                    {this.renderImage(this.state.element.image)}                    
                    <FileUploader uploaded={(fileName) => {
                        let { element } = this.state;
                        element.image = fileName;
                        this.setState({ element });
                    }} />
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