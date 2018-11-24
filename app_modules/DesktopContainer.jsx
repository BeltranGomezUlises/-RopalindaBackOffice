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
    const { fixed, activeItem } = this.state
    return (
      <div>
        <Menu fixed='top'>

          <Dropdown item simple text='Productos'>
            <Dropdown.Menu>
              <Dropdown.Item name='prendas' active={activeItem === 'prendas'}
                onClick={this.handleClick}>Prendas</Dropdown.Item>
              <Dropdown.Item name='prendasCompatibles' active={activeItem === 'prendasCompatibles'}
                onClick={this.handleClick}>Prendas Compatibles</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item name='categorias' active={activeItem === 'categorias'}
                onClick={this.handleClick}>Categorias</Dropdown.Item>
                <Dropdown.Item name='subCategorias' active={activeItem === 'subCategorias'}
                onClick={this.handleClick}>Sub-Categorias</Dropdown.Item>
            </Dropdown.Menu>
            
          </Dropdown>

          <Dropdown item simple text='Empresa'>
            <Dropdown.Menu>
              <Dropdown.Item name='empleados' active={activeItem === 'empleados'}
                onClick={this.handleClick}>Empleados</Dropdown.Item>
              <Dropdown.Item name='prospectos' active={activeItem === 'prospectos'}
                onClick={this.handleClick}>Prospectos</Dropdown.Item>
          
            </Dropdown.Menu>
          </Dropdown>

          <Menu.Menu position='right'>
            <Dropdown item simple text='Sistema'>
              <Dropdown.Menu>
                <Menu.Item name='configuraciones' active={activeItem === 'configuraciones'}
                  onClick={this.handleClick}>Configuraciones</Menu.Item>
                <Menu.Item color='yellow' onClick={() => {
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
        <br></br>
        <br></br>
        {children}
      </div>
    )
  }

}
