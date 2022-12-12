import { useCallback } from 'react';
import { Checkbox, DisclosureContent, Select, SelectItem, SelectLabel, SelectPopover, useCheckboxState, useDisclosureState, useSelectState } from 'ariakit';
import { Box, Grid, Heading, ThemeProvider } from 'theme-ui';
import { useInterval } from 'usehooks-ts';
import { keyframes } from '@emotion/react';
import { theme } from './theme';
import { useTwist } from './useTwist';

export const Twist = () => {
  const spinMilliseconds = 3000;
  const rotate = keyframes`
    100% {
      transform: rotate(2160deg);
    }`;
  const spinDisclosureState = useDisclosureState({ defaultOpen: false });
  const lastDisclosureState = useDisclosureState({ defaultOpen: false });
  const automaticCheckboxState = useCheckboxState();
  const delaySelectState = useSelectState();
  const { twist, lastSpin, currentPositions, spin } = useTwist();
  const spinClick = useCallback(() => {
    console.log(Date.now());
    if (!spinDisclosureState.open) {
      spinDisclosureState.show();
      setTimeout(() => {
        spin();
        spinDisclosureState.hide();
        lastDisclosureState.show();
      }, spinMilliseconds);
    }
  }, [lastDisclosureState, spin, spinDisclosureState]);
  const delay = Number(delaySelectState.value) * 1000 + spinMilliseconds + 20;
  useInterval(() => {
    if (automaticCheckboxState.value) {
      spinClick();
    }
  }, delay);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ fontSize: 2 }}>
        <label>🤖
          <Checkbox state={automaticCheckboxState} />
        </label>
      </Box>
      <Box sx={{ fontSize: 2 }}>
        <SelectLabel state={delaySelectState}>⏱️        </SelectLabel>
        <Select state={delaySelectState} />
        <SelectPopover state={delaySelectState}>
          <SelectItem value="0" />
          <SelectItem value="1" />
          <SelectItem value="2" />
          <SelectItem value="3" />
          <SelectItem value="4" />
          <SelectItem value="5" />
        </SelectPopover>
      </Box>
      <Box sx={{ width: '100vw', height: '100vh' }} onClick={spinClick}>
        <Box sx={{ textAlign: 'center' }}>
          <Box>
            <Heading>Current Positions</Heading>
            <Box sx={{ fontSize: 2 }}>
              <Grid columns={2}>
                <Box>{currentPositions[twist.symbols.leftHand]}{twist.symbols.leftHand}</Box>
                <Box>{twist.symbols.rightHand}{currentPositions[twist.symbols.rightHand]}</Box>
                <Box>{currentPositions[twist.symbols.leftFoot]}{twist.symbols.leftFoot}</Box>
                <Box>{twist.symbols.rightFoot}{currentPositions[twist.symbols.rightFoot]}</Box>
              </Grid>
            </Box>
          </Box>
          <DisclosureContent state={lastDisclosureState}>
            <Box>
              <Heading>Last Spin</Heading>
              <Box sx={{ fontSize: 3 }}>{lastSpin?.symbol}{lastSpin?.color}</Box>
            </Box>
          </DisclosureContent>
          <DisclosureContent state={spinDisclosureState}>
            <Box sx={{ fontSize: 4, float: 'none', animation: `${rotate} ${spinMilliseconds}ms infinite` }}>↗️</Box>
          </DisclosureContent>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
