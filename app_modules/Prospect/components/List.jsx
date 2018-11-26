import React from 'react';
import { Button, Segment, Table, Loader } from 'semantic-ui-react';
import * as utils from '../../../utils.js';
export default class List extends React.Component {

    constructor(props) {
        super(props);
    }

    renderList() {
        return this.props.collection.map(p => {
            return (
                <Table.Row key={p.mail}>
                    <Table.Cell>{p.rfc}</Table.Cell>
                    <Table.Cell>{p.name} {p.fatherLastName} {p.motherLastName}</Table.Cell>
                    <Table.Cell>{p.mail}</Table.Cell>
                    <Table.Cell>{p.birthday}</Table.Cell>
                    <Table.Cell>{p.phone}</Table.Cell>
                    <Table.Cell textAlign='center'>
                        <Button icon='check' size='small' color='green' onClick={() => {
                            this.accept(p.mail);
                        }} />
                        <Button icon='cancel' size='small' color='red' onClick={() => {
                            this.reject(p.mail);
                        }} />
                    </Table.Cell>
                </Table.Row>
            )
        })
    }

    accept(mail){
        let body = {mail:mail}
        fetch(localStorage.getItem('url') + 'prospectiveCustomers/reject', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            },
            body:JSON.stringify(body)
        }).then((res) => res.json())
            .then((response) => {
                utils.evalResponse(response, () => {
                    this.props.updateCollection();
                });
            })
    }

    reject(mail){
        let body = {mail:mail}
        fetch(localStorage.getItem('url') + 'prospectiveCustomers/reject', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            },
            body:JSON.stringify(body)
        }).then((res) => res.json())
            .then((response) => {
                utils.evalResponse(response, () => {
                    this.props.updateCollection();
                });
            })
    }

    render() {
        if (this.props.collection == null) {
            return (
                <Segment style={{ 'height': '100px' }}>
                    <Loader active size='big'>Cargando...</Loader>
                </Segment>
            )
        }        
        if (this.props.collection.length == 0) {
            return (
                <Segment textAlign='center'>
                    <h3>Sin prospectos a cliente</h3>
                </Segment>
            )
        }
        return (
            <Segment>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>RFC</Table.HeaderCell>
                            <Table.HeaderCell>Nombre del prospecto</Table.HeaderCell>
                            <Table.HeaderCell>Correo</Table.HeaderCell>
                            <Table.HeaderCell>Fecha nacimiento</Table.HeaderCell>
                            <Table.HeaderCell>Teléfono</Table.HeaderCell>
                            <Table.HeaderCell>Acciones</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderList()}
                    </Table.Body>
                </Table>
            </Segment>
        )
    }
}
