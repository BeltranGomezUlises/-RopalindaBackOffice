import React from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import * as utils from '../../../utils.js';
import FileUploader from '../../FileUploader.jsx';

export default class EntityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            warningMessage: null,
            element: {                
                name: '',                
                icon: ''                
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let {element} = this.state;

        if(element.icon == ''){
            this.setState({warningMessage:'Debe proporcionar un icono a la categoría'})
            return;
        }    

        this.setState({ loading: true });
        fetch(localStorage.getItem('url') + 'categories', {
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
                <img src={route} height="24" width="24" />
            )
        }
    }

    render() {        
        return (
            <div>
                {this.renderWarningMessage()}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field control={Input} required label='Nombre:'
                        type='text' placeholder='Nombre de la categoria...' maxLength='50'
                        value={this.state.element.name}
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.name = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>                   
                    <label>Icono:</label>
                    {this.renderImage(this.state.element.icon)}
                    <FileUploader uploaded={(fileName) => {
                        let { element } = this.state;
                        element.icon = fileName;
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