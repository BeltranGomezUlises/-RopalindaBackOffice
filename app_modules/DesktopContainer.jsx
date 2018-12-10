import React, { Component } from 'react'
import { Menu,  Dropdown} from 'semantic-ui-react'

export default class DesktopContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'formatos'
    }
    this.hideFixedMenu = this.hideFixedMenu.bind(this);
    this.showFixedMenu = this.showFixedMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  hideFixedMenu() {
    this.setState({ fixed: false })
  }

  showFixedMenu() {
    this.setState({ fixed: true })
  }

  handleClick(e, { name }) {
    let ruta = window.location.href.split('#');
    window.location.href = ruta[0] + '#/' + name;
    this.setState({ activeItem: name })
  }

  render() {
    const { children } = this.props
    const { activeItem } = this.state    
    let employee = JSON.parse(localStorage.getItem('logedUser'));    
    return (
      <div>
        <Menu fixed='top'>

          <Dropdown item simple text='Productos'>
            <Dropdown.Menu>
              <Dropdown.Item name='garment' active={activeItem === 'garment'}
                onClick={this.handleClick}>Prendas</Dropdown.Item>
              <Dropdown.Item name='compatibleGarments' active={activeItem === 'compatibleGarments'}
                onClick={this.handleClick}>Prendas Compatibles</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item  disabled={employee.employeeType != 0} name='categories' active={activeItem === 'categories'}
                onClick={this.handleClick}>Categorias</Dropdown.Item>
                <Dropdown.Item disabled={employee.employeeType != 0} name='subCategories' active={activeItem === 'subCategories'}
                onClick={this.handleClick}>Sub-Categorias</Dropdown.Item>
            </Dropdown.Menu>
            
          </Dropdown>

          <Dropdown item simple text='Empresa' disabled={employee.employeeType != 0}>
            <Dropdown.Menu>
              <Dropdown.Item name='employees' active={activeItem === 'employees'}
                onClick={this.handleClick}>Empleados</Dropdown.Item>
              <Dropdown.Item name='prospects' active={activeItem === 'prospects'}
                onClick={this.handleClick}>Prospectos</Dropdown.Item>
          
            </Dropdown.Menu>
          </Dropdown>

          <Menu.Menu position='right'>
            <Dropdown item simple text='Sistema'>
              <Dropdown.Menu>
                <Menu.Item 
                  disabled={employee.employeeType != 0}
                  name='confs' active={activeItem === 'confs'}
                  onClick={this.handleClick}>Configuraciones</Menu.Item>
                <Menu.Item onClick={() => {
                  localStorage.setItem('tokenSesion', '');
                  let ruta = window.location.href.split('#');
                  window.location.href = ruta[0] + '#/login';
                }} >
                  Salir
                   </Menu.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>        
        <div style={{marginTop: 50}}>
        {children}
        </div>
      </div>
    )
  }

}
