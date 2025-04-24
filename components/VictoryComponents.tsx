import React from 'react';
import { Platform } from 'react-native';

// Create wrapper components that conditionally import from the correct library
export const VictoryBar = (props: any) => {
  if (Platform.OS === 'web') {
    const { VictoryBar } = require('victory');
    return <VictoryBar {...props} />;
  } else {
    const { VictoryBar } = require('victory-native');
    return <VictoryBar {...props} />;
  }
};

export const VictoryChart = (props: any) => {
  if (Platform.OS === 'web') {
    const { VictoryChart } = require('victory');
    return <VictoryChart {...props} />;
  } else {
    const { VictoryChart } = require('victory-native');
    return <VictoryChart {...props} />;
  }
};

export const VictoryAxis = (props: any) => {
  if (Platform.OS === 'web') {
    const { VictoryAxis } = require('victory');
    return <VictoryAxis {...props} />;
  } else {
    const { VictoryAxis } = require('victory-native');
    return <VictoryAxis {...props} />;
  }
};

export const VictoryGroup = (props: any) => {
  if (Platform.OS === 'web') {
    const { VictoryGroup } = require('victory');
    return <VictoryGroup {...props} />;
  } else {
    const { VictoryGroup } = require('victory-native');
    return <VictoryGroup {...props} />;
  }
};

export const VictoryArea = (props: any) => {
  if (Platform.OS === 'web') {
    const { VictoryArea } = require('victory');
    return <VictoryArea {...props} />;
  } else {
    const { VictoryArea } = require('victory-native');
    return <VictoryArea {...props} />;
  }
};

export const VictoryLine = (props: any) => {
  if (Platform.OS === 'web') {
    const { VictoryLine } = require('victory');
    return <VictoryLine {...props} />;
  } else {
    const { VictoryLine } = require('victory-native');
    return <VictoryLine {...props} />;
  }
};
