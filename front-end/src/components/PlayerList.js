import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { SortableContainer } from 'react-sortable-hoc';
import PlayerListItem from './PlayerListItem';

export default SortableContainer(({players}) => <ListGroup>
  {
    players.map((player, index) =>
      <PlayerListItem key={index} index={index} player={player} />
    )
  }
</ListGroup>);
