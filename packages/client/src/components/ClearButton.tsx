import { IconButton, IconButtonProps } from '@material-ui/core';
import { DeleteRounded } from '@material-ui/icons';
import React from 'react';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

export type ClearButtonProps = IconButtonProps;

const ClearButton: React.FC<ClearButtonProps> = (props) => {
  const { state } = useAppContext();

  const handleClick = () => {
    if (!state.context) return;
    state.context.fillStyle = 'white';
    state.context.fillRect(0, 0, state.context.canvas.width, state.context.canvas.height);
    socket.emit('clear_canvas');
  };

  return (
    <IconButton onClick={handleClick} color="primary" {...props}>
      <DeleteRounded />
    </IconButton>
  );
};

export default ClearButton;
