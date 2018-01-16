import React from 'react';
import {
  Modal
, Button
, FormGroup
, ControlLabel
, FormControl
} from 'react-bootstrap';

export default class SpinModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    }
    // prebinds
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.editDone = this.editDone.bind(this);
  }
  decrement() {
    this.setState({
      value: this.state.value - 1
    })
  }
  increment() {
    this.setState({
      value: this.state.value + 1
    })
  }
  editDone() {
    this.props.editDone(this.state.value);
  }
  render() {
    return <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          {this.props.title}
        </Modal.Header>
        <Modal.Body>
          <span
            className="edit-player-attribute-figure-b"
            onClick={this.increment}
            >
            {this.state.value+1}
          </span>
          <span
            className="edit-player-attribute-figure"
            onClick={this.editDone}
          >
            {this.state.value}
          </span>
          <span
            className="edit-player-attribute-figure-b"
            onClick={this.decrement}
            >
            {this.state.value-1}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.editDone}>Done</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  }
}
