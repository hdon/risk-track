import React from 'react';
import {
  Modal
, Button
} from 'react-bootstrap';

export default ({onYes, onNo}) => 
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        New Game
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to end this game and begin a new one?</p>
        <p>It could take <em>hours.</em></p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onNo}>Nevermind</Button>
        <Button onClick={onYes} bsStyle="danger">Delete Current Game</Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>
