import { IconButton, IconButtonProps, makeStyles } from '@material-ui/core';
import CreateRounded from '@material-ui/icons/CreateRounded';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {
    transform: 'rotate(180deg)',
  },
});

export type EraserButtonProps = IconButtonProps;

const EraserButton: React.FC<EraserButtonProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { dispatch } = useAppContext();

  const handleClick = () => {
    dispatch({ type: 'select-color', color: 'white' });
  };

  return (
    <IconButton
      className={clsx(classes.root, className)}
      onClick={handleClick}
      color="primary"
      {...rest}
    >
      <CreateRounded />
    </IconButton>
  );
};

export default EraserButton;
