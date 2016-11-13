
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
        <span className="titulo">{this.props.name.split('.').join(' ')}</span>
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
      list: []
    }

    let self = this;
    eventEmitter.addListener('cobro', (data) => {
      console.log(data)
      model.obtenerRegistro(data.id_db)
        .then(answ => {
          // console.log(answ)

          answ.id = data.id;
          answ.id_db = data.id_db

          self.setState((prev) => {
            prev.list.push(answ)

            return {
              list: prev.list
            }
          })

          return model.actualizarRegistro(data.id_db)
        })
        .then(answ => {
          self.setState(prev => {

            answ.id_db = answ.id
            answ.id = data.id

            prev.list.pop()

            prev.list.push(answ)

            return {
              list: prev.list
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  render () {

    let list = this.state.list.map(element => {
      return (
        <CobroItem key={element.id_db} name={element.id}>
          <Hora clase="ingreso">{element.timeBegin}</Hora>
          <Hora clase="salida">{element.timeEnd}</Hora>
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
