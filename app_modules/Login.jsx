import React from 'react';
import { Button, Segment, Divider, Header, Input, Form, Container} from 'semantic-ui-react';
import * as utils from '../utils.js';

export default class Login extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      user: '',
      pass: '',
      message: '',
      loading:false
    }

    localStorage.setItem('tokenSesion', '');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);

    let ruta = window.location.href.split('#');
    window.location.href = ruta[0] + '#/login';
  }

  handleSubmit(){
    fetch(localStorage.getItem('url') + 'employees/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: this.state.user,
        pass: this.state.pass,
      })
    }).then((res) => res.json())
    .then((response) => {
      this.setState({loading: false});
      utils.evalResponse(response, () => {
        localStorage.setItem('tokenSesion', response.data.token);
        localStorage.setItem('logedUser', JSON.stringify(response.data.employee));
        let ruta = window.location.href.split('#');
        window.location.href = ruta[0] + '#/prendas';
      }, response.meta.message);
    })
  }

  handleUserChange(evt){
    this.setState({user: evt.target.value});
  }

  handlePassChange(evt){
    this.setState({pass: evt.target.value});
  }

  renderMessage(){
    if (this.state.message !== '') {
      return (
        <Segment color='yellow'>
          {this.state.message}
        </Segment>
      )
    }
  }

  renderButton(){
    if (this.state.loading) {
      return(
          <Button fluid loading primary>Iniciar Sesion</Button>
      );
    }else{
      return(
        <Button fluid primary type='submit' onClick={()=>{this.setState({loading:true}); this.handleSubmit();}}>Iniciar Sesion</Button>
      );
    }
  }

  render(){
    return(
      <div style={{'paddingTop':'100px'}}>
        <Container text >
          <Segment verticalalign='middle'>
            <Header textAlign='center' color='blue'>Ropalinda Backoffice</Header>
            <Divider section/>
              {this.renderMessage()}
              <Form size='large'>
                <Form.Input fluid icon='user' iconPosition='left' placeholder='Ingrese el usuario...' onChange={this.handleUserChange}/>
                <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' type='password' onChange={this.handlePassChange}/>
                {this.renderButton()}
              </Form>
          </Segment>
        </Container>
      </div>
    )
  }
}
// onSubmit={this.handleSubmit}
