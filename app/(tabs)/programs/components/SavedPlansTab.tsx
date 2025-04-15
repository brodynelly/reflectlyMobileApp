import { View, Text, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';

export function SavedPlansTab() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  return (
    <View style={styles.container}>
      <View style={styles.emptyState}>
        <BookOpen size={48} color="#94a3b8" />
        <Text style={styles.emptyStateTitle}>No saved programs</Text>
        <Text style={styles.emptyStateText}>
          Programs you save will appear here for easy access
        </Text>
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
  },
}));