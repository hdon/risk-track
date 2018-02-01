import React from 'react';
import { Badge } from 'react-bootstrap';
import ClickNHold from 'react-click-n-hold';

export default props => <td>
  <ClickNHold time={0.5} onClickNHold={props.onClickNHold}>
    <div onClick={props.onClick} className="homeFigure">
      <Badge>
        {props.text}
      </Badge>
      { /* TODO i really don't like this className assignment */ }
    </div>
  </ClickNHold>
</td>
