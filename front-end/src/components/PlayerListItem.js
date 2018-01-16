import React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';

export default SortableElement(({player: {name}}) =>
  <ListGroupItem>
    {name}
  </ListGroupItem>
)
