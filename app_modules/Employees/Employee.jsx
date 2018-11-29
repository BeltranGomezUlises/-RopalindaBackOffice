import React from 'react';
import { Segment } from 'semantic-ui-react';

import Filter from './components/Filter.jsx';
import List from './components/List.jsx';


export default class Employee extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            collection: null
        }

        this.child = React.createRef();
        this.updateCollection = this.updateCollection.bind(this);
        this.filter = this.filter.bind(this);
    }

    updateCollection(collection) {
        this.setState({ collection })
    }

    filter(){
        this.child.current.filter()
    }

    render() {
        return (
            <div>
                <Segment textAlign='center'>
                    <h3>Empleados</h3>
                </Segment>
                <Filter ref={this.child} updateCollection={this.updateCollection} />
                <List collection={this.state.collection} filter={this.filter} />
            </div>
        )
    }
}
