import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import Notifications from 'react-notify-toast';
import config from './config.json';
// app_modules
import Login from './app_modules/Login.jsx';
import Prospecto from './app_modules/Prospectos/Prospecto.jsx';
import Compatible from './app_modules/Compatible/Compatible.jsx';
import DesktopContainer from './app_modules/DesktopContainer.jsx';

const App =()=>(
    <HashRouter>
        <MainContainer></MainContainer>
    </HashRouter>
)

class MainContainer extends React.Component{

  constructor(props) {
    super(props);
    this.state = {menuVisible: true};
    localStorage.setItem('url', config.apiUrl );
  }

  renderMainContent(){
    if (localStorage.getItem('tokenSesion') === ''
        || localStorage.getItem('tokenSesion') === null){
      return(<Login/>);
    }else{
      return(
        <DesktopContainer>       
          <Route path="/login" component={Login}/>          
          <Route path="/prospectos" component={Prospecto}/>          
          <Route path="/prendasCompatibles" component={Compatible}/>       
        </DesktopContainer>
      )
    }
  }

  render() {
    return(
      <div>
        <Notifications />
        {this.renderMainContent()}
      </div>
    )
  }
}


export default App;
