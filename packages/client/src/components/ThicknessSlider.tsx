import React from 'react';
import { makeStyles, Slider, SliderProps } from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {},
});

const MIN_THICKNESS = 3;
const MAX_THICKNESS = 100;

export type ThicknessSliderProps = SliderProps;

const ThicknessSlider: React.FC<ThicknessSliderProps> = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { state, dispatch } = useAppContext();

  const handleSliderChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: number | number[],
  ) => {
    dispatch({ type: 'set-thickness', thickness: value as number });
  };

  return (
    <Slider
      className={clsx(classes.root, className)}
      min={MIN_THICKNESS}
      max={MAX_THICKNESS}
      value={state.thickness}
      onChange={handleSliderChange}
      {...rest}
    />
  );
};

export default ThicknessSlider;
