import { Platform } from 'react-native';

// Import the appropriate component based on the platform
let InsightsScreen;

if (Platform.OS === 'ios') {
  InsightsScreen = require('./insights.ios').default;
} else {
  InsightsScreen = require('./insights.web').default;
}

export default InsightsScreen;
