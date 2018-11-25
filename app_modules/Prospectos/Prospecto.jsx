import React from 'react';
import {Segment} from 'semantic-ui-react';
import List from './componentes/List.jsx';
import * as utils from '../../utils.js';

export default class Prospecto extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            collection: null
        }

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(){
        fetch(localStorage.getItem('url') + 'prospectiveCustomers', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('tokenSesion')
            }
        }).then((res) => res.json())
            .then((response) => {
                utils.evalResponse(response, () => {
                    this.setState({ collection: response.data })
                    console.log(this.state);
                });
            })
    }

    render() {
        return (
            <div>
                <Segment textAlign='center'>                                                            
                    <h3>Prospectos a cliente</h3>
                </Segment>
                
                <List collection={this.state.collection} updateCollection={this.loadData} />
            </div>
        )
    }
}
