import React from 'react';
import {
  ListGroupItem
, Checkbox
} from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';

export default SortableElement(({player, onToggle}) =>
  <ListGroupItem>
    <Checkbox
      checked={player.included}
      inline
      onChange={ev=>{onToggle(player.name, ev.target.checked)}}
    />
    {player.name}
  </ListGroupItem>
)
