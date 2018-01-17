import React from 'react';
import AddPlayerModal from './components/AddPlayerModal';
import PlayerListEdit from './components/PlayerListEdit';
import SpinModal from './components/SpinModal';
import { arrayMove } from 'react-sortable-hoc';
import ClickNHold from 'react-click-n-hold';
import {
  Well
, Glyphicon
, Grid
, Row
, Col
, PageHeader
, Navbar
, NavItem
, Nav
, NavDropdown
, ListGroup
, ListGroupItem
, Table
, Badge
, Button
} from 'react-bootstrap';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: {
        what: 'default'
      }
    , players: []
    //  { name: 'Gena',     power: 20, land: 10, bonus: 2}
    //, { name: 'Don',      power: 30, land: 12, bonus: 0}
    //, { name: 'Amanda',   power: 40, land: 14, bonus: 7}
    //, { name: 'Brandon',  power: 50, land: 16, bonus: 7}
    //, { name: 'Justin',   power: 60, land: 18, bonus: 0}
    //]
    , currentPlayer: -1
    , minSpawnRate: 3
    }
    // prebinds
    this.onSortPlayersEnd = this.onSortPlayersEnd.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.editPlayerAttributeDone = this.editPlayerAttributeDone.bind(this);
    this.advanceTurn = this.advanceTurn.bind(this);
    this.decrementPlayerPower = this.decrementPlayerPower.bind(this);
    this.playerTakeLand = this.playerTakeLand.bind(this);
    this.configMinimumSpawnRate = this.configMinimumSpawnRate.bind(this);
    this.configMinimumSpawnRateDone = this.configMinimumSpawnRateDone.bind(this);
  }
  onSortPlayersEnd({ oldIndex, newIndex }) {
    this.setState({
      players: arrayMove(this.state.players, oldIndex, newIndex)
    })
  }
  addPlayer(newPlayerName) {
    this.setState({
      players: [ ...this.state.players, {
        name: newPlayerName
      , power: 24
      , land:  8
      , bonus: 0
      }]
    })
  }
  editPlayerAttribute(attribute, iPlayer) {
    return () => {
      this.setState({
        display: {
          what: 'editPlayerAttribute'
        , attribute
        , iPlayer
        }
      })
    }
  }
  editPlayerAttributeDone(value) {
    const player = this.state.players[this.state.display.iPlayer];
    const attribute = this.state.display.attribute;
    player[attribute] = value;
    this.setState({
      display: {
        what: 'default'
      }
    })
  }
  configMinimumSpawnRate() {
    this.setState({
      display: {
        what: 'configMinimumSpawnRate'
      }
    })
  }
  configMinimumSpawnRateDone(minSpawnRate) {
    this.setState({
      minSpawnRate
    , display: {
        what: 'default'
      }
    })
  }
  advanceTurn() {
    const currentPlayer = (this.state.currentPlayer+1) % this.state.players.length;
    const minSpawnRate = this.state.minSpawnRate;
    const players = this.state.players.map((player, iPlayer) =>
      iPlayer == currentPlayer
    ? {
        ...player
      , power: player.power + Math.max(
          Math.floor(player.land/3) + player.bonus
        , minSpawnRate
        )
      }
    : player
    );
    this.setState({
      currentPlayer
    , players
    })
  }
  decrementPlayerPower(targetPlayer) {
    this.setState({
      players: this.state.players.map((player, iPlayer) =>
        targetPlayer == iPlayer
      ? { ...player, power: player.power-1 }
      : player
      )
    })
  }
  playerTakeLand(targetPlayer) {
    const currentPlayer = this.state.currentPlayer;
    this.setState({
      players: this.state.players.map((player, iPlayer) =>
        targetPlayer == iPlayer
      ? { ...player, land: player.land-1 }
      : currentPlayer == iPlayer
      ? { ...player, land: player.land+1 }
      : player
      )
    })
  }

  editPlayerAttributeRender() {
    const player = this.state.players[this.state.display.iPlayer];
    const playerName = player.name;
    const attribute = this.state.display.attribute;
    const value = player[attribute];
    const title = `Edit ${playerName}'s ${attribute}`;
    return <SpinModal
      title={title}
      value={value}
      editDone={this.editPlayerAttributeDone}
    />
  }
  configMinimumSpawnRateRender() {
    return <SpinModal
      title="Set Minimum Spawn Rate"
      value={this.state.minSpawnRate}
      editDone={this.configMinimumSpawnRateDone}
    />
  }
  defaultRender() {
    return this.state.players.length
    ? <div>
        <div className="d-flex justify-content-between">
          <Button
            onClick={this.advanceTurn}
            bsSize="large"
          >
            Next Turn
          </Button>
        </div>
        <Table bordered className="home-player-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Bonus</th>
              <th>Land</th>
              <th>Power</th>
            </tr>
          </thead>
          <tbody>
            { this.state.players.map(({name, power, land, bonus}, iPlayer) =>
                <tr
                  className={this.state.currentPlayer == iPlayer ? 'success' : 'danger'}
                  key={iPlayer}
                >
                  <td>{name}</td>
                  <td>
                    <ClickNHold
                      time={0.5}
                      onClickNHold={this.editPlayerAttribute('bonus', iPlayer)}
                    >
                      <div
                        onClick={this.editPlayerAttribute('bonus', iPlayer)}
                      >
                        <Badge
                        >
                          {bonus}
                        </Badge>
                      </div>
                    </ClickNHold>
                  </td>
                  <td>
                    <ClickNHold
                      time={0.5}
                      onClickNHold={this.editPlayerAttribute('land', iPlayer)}
                    >
                      <div
                        onClick={this.playerTakeLand.bind(this, iPlayer)}
                      >
                        <Badge
                        >
                          {land}
                        </Badge>
                      </div>
                    </ClickNHold>
                  </td>
                  <td>
                    <ClickNHold
                      time={0.5}
                      onClickNHold={this.editPlayerAttribute('power', iPlayer)}
                    >
                      <div
                        onClick={this.decrementPlayerPower.bind(this, iPlayer)}
                      >
                        <Badge
                        >
                          {power}
                        </Badge>
                      </div>
                    </ClickNHold>
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </div>
    : <Well>Looks like you have no players</Well>
    return null;
  }
  editPlayersRender() {
    return <PlayerListEdit
      players={this.state.players}
      onSortPlayersEnd={this.onSortPlayersEnd}
      onAdd={this.addPlayer}
    />
  }
  addPlayerRender() {
    return <AddPlayerModal
      onClose={()=>{this.setState({display:{what:'default'}})}}
      onAdd={this.addPlayer}
    />
  }
  render() {
    return <div>
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a>Risk Track</a>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem onClick={()=>{this.setState({display: {what: 'default'}})}}>
              <Glyphicon glyph="home"/> Home
            </NavItem>
            <NavItem onClick={()=>{this.setState({display: {what: 'editPlayers'}})}}>
              <Glyphicon glyph="pencil"/> Edit Players
            </NavItem>
            <NavItem onClick={this.configMinimumSpawnRate}>
              <Glyphicon glyph="asterisk"/> Spawn Rate
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      { this[this.state.display.what+'Render']() }
    </div>
  }
}

export default App;
