import React from 'react';
import { Loader } from 'semantic-ui-react';
import * as utils from '../utils.js';

export default class FileUploader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(file) {
        this.setState({ loading: true });
        console.log(file)
        if (file) {
            let data = new FormData()
            data.append('file', file);
            console.log('data', data)
            fetch(localStorage.getItem('url') + 'utilities/upload', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: data
            }).then((res) => res.json())
                .then((r) => {
                    this.setState({ loading: false });
                    console.log('exito');
                    utils.evalResponse(r, () => {
                        console.log('exito');
                        this.props.uploaded(r.data);
                    });
                })
        }
    }

    renderLoading() {
        if (this.state.loading) {
            return (
                <Loader active>Subiendo...</Loader>
            )
        }
    }

    render() {
        return (
            <div>
                <input id="uploadFile"
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={(evt) => {                        
                        this.handleSubmit(evt.target.files[0]);
                    }} />
                {this.renderLoading()}
            </div>
        );
    }

}