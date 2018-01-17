import React from 'react';
import PlayerList from './PlayerList';
import {
  Well
, Modal
, Button
, FormGroup
, ControlLabel
, FormControl
} from 'react-bootstrap';

export default
class PlayerListEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPlayerName: ''
    }
    // prebinds
    this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onToggleRemembered = this.onToggleRemembered.bind(this);
  }
  onAdd(ev) {
    ev.preventDefault();
    this.props.onAdd(this.state.newPlayerName)
    this.setState({
      newPlayerName: ''
    })
  }
  onToggleRemembered(name, included) {
    if (included)
      this.props.onAdd(name);
    else
      this.props.onRm(name);
  }
  getValidationState() {
    return this.state.newPlayerName.length == 0
    ? 'warning'
    : 'success'
  }
  handleChange(ev) {
    this.setState({ newPlayerName: ev.target.value })
  }
  render() {
    return <div>
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
            value={this.state.newPlayerName}
            placeholder="New Player Name"
            onChange={this.handleChange}
            autoFocus
          />
        </FormGroup>
      </form>
      {
        this.props.players.length
        ?  <PlayerList
            players={this.props.players}
            onSortEnd={this.props.onSortPlayersEnd}
            onToggle={this.onToggleRemembered}
           />
        : <Well>Looks like you have no players</Well>
      }
    </div>
  }
}
