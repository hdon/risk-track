import React from 'react';
import AddPlayerModal from './components/AddPlayerModal';
import PlayerListEdit from './components/PlayerListEdit';
import SpinModal from './components/SpinModal';
import { arrayMove } from 'react-sortable-hoc';
import ClickNHold from 'react-click-n-hold';
import NewGameConfirmModal from './components/NewGameConfirmModal';
import PowerProjectionChart from './components/PowerProjectionChart';
import EditableFigure from './components/EditableFigure';
import * as rLS from 'react-localstorage';
import * as _ from 'lodash';
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

/* Bump this version number if you make a change which is not compatible
 * with older states saved to localStorage.
 *
 * TODO capability to migrate/upgrade old states to new versions?
 *
 * TODO prompt user for what to do with their old data?
 *
 * TODO maybe don't overwrite old-version state data and just keep it
 * around so the user can load up an old version of the software and still
 * operate their old data?
 *
 * NOTE this project isn't really important enough to warrant this much
 * thought being put into it :3
 */
const STATE_VERSION = 0;
const INITIAL_STATE = {
  display: {
    what: 'editPlayers'
  }
, players: []
, currentPlayer: -1
, minSpawnRate: 3
, stateVersion: STATE_VERSION
, rememberedPlayerNames: []
};

class App extends React.Component {
  constructor(props) {
    super(props);
    /* NOTE this state will be blown away by react-localstorage in
     * componentDidMount() if this isn't the first time we're running the
     * application, unless the old state is not STATE_VERSION in which case
     * it will be deleted.
     */
    this.state = INITIAL_STATE;
    // prebinds
    this.onSortPlayersEnd = this.onSortPlayersEnd.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.rmPlayer = this.rmPlayer.bind(this);
    this.editPlayerAttributeDone = this.editPlayerAttributeDone.bind(this);
    this.advanceTurn = this.advanceTurn.bind(this);
    this.decrementPlayerPower = this.decrementPlayerPower.bind(this);
    this.playerTakeLand = this.playerTakeLand.bind(this);
    this.configMinimumSpawnRate = this.configMinimumSpawnRate.bind(this);
    this.configMinimumSpawnRateDone = this.configMinimumSpawnRateDone.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    /* glue for local storage of our component state */
    rLS.componentWillUpdate.apply(this, arguments);
    /* check version of state and reinitialize if it doesn't match */
    if (nextState.stateVersion !== STATE_VERSION)
      this.setState(INITIAL_STATE);
  }
  componentDidMount() {
    /* glue for local storage of our component state */
    rLS.componentDidMount.apply(this, arguments);
  }

  onSortPlayersEnd({ oldIndex, newIndex }) {
    /* refuse to sort when either index is out of bounds; the list contains
     * representations of rememberedPlayerNames after its representations
     * of included players, which we make not sortable here
     *
     * TODO maybe make them sortable separately? idk
     */
    const numPlayers = this.state.players.length;
    if (oldIndex >= numPlayers || newIndex >= numPlayers)
      return;
    
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
  rmPlayer(playerName) {
    const rememberedPlayerNames = _.uniq(
      _.concat(
        _.map(this.state.players, 'name')
      , this.state.rememberedPlayerNames
      )
    );
    this.setState({
      players: this.state.players.filter(p => p.name !== playerName)
    , rememberedPlayerNames
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
  newGame() {
    console.log('newGame()');
    /* deduplicate player names for storage */
    let rememberedPlayerNames = {};
    console.log('state.players=', this.state.players);
    this.state.players.forEach(p =>
      rememberedPlayerNames[p.name] = 0
    );
    console.log('state.rememberedPlayerNames=', this.state.rememberedPlayerNames);
    this.state.rememberedPlayerNames.forEach(name =>
      rememberedPlayerNames[name] = 0
    );
    rememberedPlayerNames = Object.keys(rememberedPlayerNames);
    /* new game state, plus new remembered names list */
    this.setState({
      players: []
    , rememberedPlayerNames
    , currentPlayer: -1
    , display: {
        what: 'editPlayers'
      }
    })
  }

  powerProjectionRender() {
    return <PowerProjectionChart
      players={this.state.players}
      minSpawnRate={this.state.minSpawnRate}
    />
  }
  newGameModalRender() {
    return <NewGameConfirmModal
      onYes={this.newGame}
      onNo={()=>{this.setState({display: {what: 'default'}})}}
    />
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
                  <EditableFigure
                    onClick={this.editPlayerAttribute('bonus', iPlayer)}
                    onClickNHold={this.editPlayerAttribute('bonus', iPlayer)}
                    text={bonus}
                  />
                  <EditableFigure
                    onClickNHold={this.editPlayerAttribute('land', iPlayer)}
                    onClick={this.playerTakeLand.bind(this, iPlayer)}
                    text={land}
                  />
                  <EditableFigure
                    onClickNHold={this.editPlayerAttribute('power', iPlayer)}
                    onClick={this.decrementPlayerPower.bind(this, iPlayer)}
                    text={power}
                  />
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
    const playersByName = {};
    this.state.players.forEach(p =>
      playersByName[p.name] = {
        name: p.name
      , included: true
      }
    );
    this.state.rememberedPlayerNames.forEach(name => {
      if (!(name in playersByName)) {
        playersByName[name] = {
          name
        , included: false
        }
      }
    });
    const players = Object.values(playersByName);

    return <PlayerListEdit
      players={players}
      onSortPlayersEnd={this.onSortPlayersEnd}
      onAdd={this.addPlayer}
      onRm={this.rmPlayer}
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
            <NavItem onClick={()=>{this.setState({display: {what: 'newGameModal'}})}}>
              <Glyphicon glyph="off"/> New Game
            </NavItem>
            <NavItem onClick={()=>{this.setState({display: {what: 'editPlayers'}})}}>
              <Glyphicon glyph="pencil"/> Edit Players
            </NavItem>
            <NavItem onClick={this.configMinimumSpawnRate}>
              <Glyphicon glyph="asterisk"/> Spawn Rate
            </NavItem>
            <NavItem onClick={()=>{this.setState({display: {what: 'powerProjection'}})}}>
              { /* TODO how do glyphicons come across for vision impaired
              users? "signal" is not meaningful here, but visually this
              icon also resembles a bar chart */ }
              <Glyphicon glyph="signal"/> Troop Power Projection
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      { this[this.state.display.what+'Render']() }
    </div>
  }
}

export default App;
