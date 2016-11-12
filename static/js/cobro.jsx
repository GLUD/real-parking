
import React from 'react';
import {render} from 'react-dom';

class Hora extends React.Component {
  render(){
    return (
      <span className={this.props.clase}>
        {this.props.children}
      </span>
    )
  }
}

class CobroItem extends React.Component {
  render() {
    return (
      <li className="coleccion-item">
        <span className="titulo">{this.props.id.split('.').join(' ')}</span>
        <div className="content">
          <div className="info">
            {this.props.children}
          </div>
          <div className="close">
            <a href="#">Cerrar</a>
          </div>
        </div>
      </li>
    );
  }
}

class ListaCobro extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          id: 'isla.1',
          horaIngreso: '2:00:00',
          horaSalida: '4:00:00',
          monto: '4.000'
        },
        {
          id: 'isla.2',
          horaIngreso: '2:00:00',
          horaSalida: '4:00:00',
          monto: '4.000'
        },
        {
          id: 'isla.3',
          horaIngreso: '2:00:00',
          horaSalida: '4:00:00',
          monto: '4.000'
        }
      ]
    }
  }
  render () {

    let list = this.state.list.map(element => {
      return (
        <CobroItem key={element.id} id={element.id}>
          <Hora clase="ingreso">{element.horaIngreso}</Hora>
          <Hora clase="salida">{element.horaSalida}</Hora>
          <span className="monto">{element.monto}</span>
        </CobroItem>
      )
    })

    return (
      <ul className="coleccion-cobros">
        {list}
      </ul>
    );
  }
}

render(<ListaCobro/>, document.getElementById('cobros'))
