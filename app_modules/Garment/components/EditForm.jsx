import React from 'react';
import { Form, Card, Button, Input, Message, Dropdown, Segment, Loader, Popup } from 'semantic-ui-react';
import * as utils from '../../../utils.js';
import FileUploader from '../../FileUploader.jsx';
import CmbSubCategory from '../../CmbCatalog/CmbSubCategory.jsx';


export default class EntityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            warningMessage: null,
            element: null,
            compatibleOptions: [],
            compatibleAssigned:[]
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch(localStorage.getItem("url") + 'garments/' + this.props.entity.id, {
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
                    let compatibleAssigned = r.data.compatibleGarmentList.map(item => item.id);
                    this.setState({ element: r.data, compatibleAssigned});
                });
            })

        fetch(localStorage.getItem('url') + 'compatibleGarments?select=id,name,previewImage,active=true', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            }
        }).then((res) => res.json())
            .then((r) => {
                this.setState({ filtering: false });
                utils.evalResponse(r, () => {
                    let compatibleOptions = [];
                    r.data.forEach(item => {
                        compatibleOptions.push({text: item.name, value: item.id, image:{
                            avatar: true, src: localStorage.getItem('url') + 'utilities/getFile/' + item.previewImage
                        }});
                    });                    
                    this.setState({compatibleOptions});                    
                })
            });


    }

    handleSubmit() {
        let { element } = this.state;

        if (element.previewImage == '') {
            this.setState({ warningMessage: 'Debe proporcionar una imagen de previzualización' })
            return;
        }
        if (element.subcategory.id == null) {
            this.setState({ warningMessage: 'Debe proporcionar una sub-categoría' })
            return;
        }

        let compatibleGarmentList = this.state.compatibleAssigned.map(item => {
            return {id: item}
        })        
        element.compatibleGarmentList = compatibleGarmentList;

        this.setState({ loading: true });
        fetch(localStorage.getItem('url') + 'garments', {
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
                }, 'Prenda editada con éxito.');
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

    renderImage(imageName) {
        if (imageName !== null && imageName !== '') {
            let route = localStorage.getItem('url') + 'utilities/getFile/' + imageName;
            return (
                <Card image={route} />
            )
        }
    }

    renderImageList(imageList) {
        return imageList.map(image => {
            let route = localStorage.getItem('url') + 'utilities/getFile/' + image.imagesPK.imagePath;
            return (
                <Popup key={image.imagesPK.imagePath} trigger={
                    <Card image={route} onClick={() => {
                        let { imagesList } = this.state.element;
                        let index = -1;
                        for (let i = 0; i < imagesList.length; i++) {
                            if (imagesList[i].imagesPK.imagePath == image.imagesPK.imagePath) {
                                index = i;
                                break;
                            }
                        }
                        imagesList.splice(index, 1);
                        this.setState({ imagesList });
                    }} />
                } content='Click para remover' />
            )
        });
    }

    render() {
        let employee = JSON.parse(localStorage.getItem('logedUser'));
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
                    <Form.Field control={Input} required label='Nombre:'
                        type='text' placeholder='Nombre de la prenda...' maxLength='50'
                        value={this.state.element.name}
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.name = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>
                    <Form.Field control={Input} required label='Descripción:'
                        type='text' placeholder='Descripción de la prenda...' maxLength='50'
                        value={this.state.element.description}
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.description = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>
                    <Form.Field control={Input} required disabled={employee.employeeType != 0}
                        label='Precio:' type='number' placeholder='Precio de la prenda...'
                        value={this.state.element.price}
                        min='1' max='9999' step='0.01'
                        onChange={(evt) => {
                            let { element } = this.state;
                            element.price = evt.target.value;
                            this.setState({ element });
                        }}
                    >
                    </Form.Field>
                    <CmbSubCategory onChange={(value) => {
                        let { element } = this.state;
                        element.subcategory.id = value;
                        this.setState({ element });
                    }} />
                    <label>Foto previsualización:</label>
                    <FileUploader uploaded={(fileName) => {
                        let { element } = this.state;
                        element.previewImage = fileName;
                        this.setState({ element });
                    }} />
                    {this.renderImage(this.state.element.previewImage)}
                    <br></br>
                    <label>Fotos grandes:</label>
                    <FileUploader uploaded={(fileName) => {
                        let { element } = this.state;
                        element.imagesList.push({
                            active: true,
                            imagesPK: {
                                garment: this.props.entity.id,
                                imagePath: fileName
                            }
                        });
                        this.setState({ element });
                    }} />
                    <br></br>
                    <Card.Group itemsPerRow={4}>
                        {this.renderImageList(this.state.element.imagesList)}
                    </Card.Group>
                    <br></br>
                    <Dropdown                        
                        fluid
                        multiple
                        search
                        selection
                        options={this.state.compatibleOptions}
                        value={this.state.compatibleAssigned}
                        placeholder='Seleccione prendas compatibles a asignar'
                        onChange={(e, {value}) => {                            
                            this.setState({compatibleAssigned: value})
                        }}
                    />
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