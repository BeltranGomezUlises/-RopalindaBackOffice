import React from 'react';
import { Button, Segment, Table, Modal, Header } from 'semantic-ui-react';
import * as utils from '../../../utils.js';
import EntityEdit from './EditForm.jsx';

export default class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            activeEntity: null,
            modalOpenEliminar: false,
            modalOpenEditar: false
        }
        this.closeModalEliminar = this.closeModalEliminar.bind(this);
        this.openModalEliminar = this.openModalEliminar.bind(this);
        this.closeModalEditar = this.closeModalEditar.bind(this);
        this.openModalEditar = this.openModalEditar.bind(this);
        this.eliminar = this.eliminar.bind(this);
    }

    openModalEliminar() {
        this.setState({ modalOpenEliminar: true });
    };

    closeModalEliminar() {
        this.setState({ modalOpenEliminar: false });
    };

    openModalEditar() {
        this.setState({ modalOpenEditar: true });
    };

    closeModalEditar() {
        this.setState({ modalOpenEditar: false });
    };

    eliminar() {
        this.setState({ loading: true });
        fetch(localStorage.getItem('url') + 'compatibleGarments/' + this.state.activeEntity.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            }
        }).then((res) => res.json())
            .then((response) => {
                this.setState({ loading: false });
                this.closeModalEliminar();
                utils.evalResponse(response, () => {
                    this.props.filter();
                }, 'Prenda compatible eliminada');
            });
    };

    renderList() {
        return this.props.collection.map(p => {
            let imageRoute = localStorage.getItem('url') + 'utilities/getFile/' + p.previewImage;
            return (
                <Table.Row key={p.id}>
                    <Table.Cell>
                        <img src={imageRoute} height="120" width="120" />
                    </Table.Cell>
                    <Table.Cell>{p.name}</Table.Cell>
                    <Table.Cell>{p.description}</Table.Cell>
                    <Table.Cell>{p.price}</Table.Cell>
                    <Table.Cell textAlign='center'>
                        <Button icon='edit' size='small' color='blue' onClick={() => {
                            this.setState({ activeEntity: p });
                            this.openModalEditar();
                        }} />
                        <Button icon='trash' size='small' color='red' onClick={() => {
                            this.setState({ activeEntity: p });
                            this.openModalEliminar();
                        }} />
                    </Table.Cell>
                </Table.Row>
            )
        })
    }

    render() {
        if (this.props.collection == null) {
            return (
                <Segment style={{ 'height': '100px' }}>
                    Buscar prendas para mostrar...
                </Segment>
            )
        }
        if (this.props.collection.length == 0) {
            return (
                <Segment textAlign='center'>
                    <h3>Sin prendas compatibles para mostrar</h3>
                </Segment>
            )
        }
        return (
            <Segment>

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Previsualización</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Descripcion</Table.HeaderCell>
                            <Table.HeaderCell>Precio</Table.HeaderCell>
                            <Table.HeaderCell>Acciones</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderList()}
                    </Table.Body>
                </Table>
                {/*Modal para eliminar*/}
                <Modal
                    onClose={this.closeModalEliminar}
                    onOpen={this.openModalEliminar}
                    open={this.state.modalOpenEliminar}>
                    <Header content='Eliminar prenda compatible' textAlign='center' />
                    <Modal.Content>
                        <h4 align='center'>¿Está seguro de eliminar la prenda compatible?</h4>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button loading={this.state.loading}
                            color='red'
                            onClick={this.state.loading ? null : this.eliminar}>
                            Eliminar
                        </Button>
                    </Modal.Actions>
                </Modal>
                {/*Modal para editar*/}
                <Modal
                    onClose={this.closeModalEditar}
                    onOpen={this.openModalEditar}
                    open={this.state.modalOpenEditar}>
                    <Header content='Editar prenda compatible' textAlign='center' />
                    <Modal.Content>
                        <EntityEdit entity={this.state.activeEntity} 
                            closeModal={this.closeModalEditar}
                            filter={this.props.filter}/>
                    </Modal.Content>                 
                </Modal>

            </Segment>
        )
    }
}
