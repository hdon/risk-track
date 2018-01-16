import React from 'react';
import {
  Modal
, Button
, FormGroup
, ControlLabel
, FormControl
} from 'react-bootstrap';

export default class AddPlayerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    // prebinds
    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }
  onAdd(ev) {
    ev.preventDefault();
    this.props.onAdd(this.state.value)
  }
  getValidationState() {
    return this.state.value.length == 0
    ? 'warning'
    : 'success'
  }
  handleChange(ev) {
    this.setState({ value: ev.target.value })
  }
  render() {
    return <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          Add Player
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.onAdd}>
            <FormGroup
              controlId="addPlayerName"
              validationState={this.getValidationState()}
            >
              <ControlLabel>
                New Player Name
              </ControlLabel>
              <FormControl
                type="text"
                value={this.state.value}
                placeholder="New Player Name"
                onChange={this.handleChange}
                autoFocus
              />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>Done</Button>
          <Button type="submit" bsStyle="primary">Add</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  }
}
