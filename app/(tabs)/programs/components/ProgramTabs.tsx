import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';

type ProgramTabsProps = {
  activeTab: 'my-plans' | 'find' | 'saved' | 'completed';
  onTabChange: (tab: 'my-plans' | 'find' | 'saved' | 'completed') => void;
};

export function ProgramTabs({ activeTab, onTabChange }: ProgramTabsProps) {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
      contentContainerStyle={styles.tabsContent}>
      <Pressable
        style={[styles.tab, activeTab === 'my-plans' && styles.activeTab]}
        onPress={() => onTabChange('my-plans')}>
        <Text style={[styles.tabText, activeTab === 'my-plans' && styles.activeTabText]}>
          My Plans
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === 'find' && styles.activeTab]}
        onPress={() => onTabChange('find')}>
        <Text style={[styles.tabText, activeTab === 'find' && styles.activeTabText]}>
          Find Plans
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
        onPress={() => onTabChange('saved')}>
        <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
          Saved
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
        onPress={() => onTabChange('completed')}>
        <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
          Completed
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  tabsContainer: {
    backgroundColor: theme.card,
    borderBottomWidth: 0, // Removed border
    paddingBottom: 0, // No bottom padding
    marginTop: 0, // No top margin
    marginBottom: 0, // No bottom margin
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 0, // No vertical padding
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    height: 36, // Reduced height for the tabs container
  },
  tab: {
    paddingVertical: 2, // Further reduced vertical padding
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: theme.background,
    height: 26, // Reduced height for tabs
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: theme.primary,
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: theme.subtext,
  },
  activeTabText: {
    color: theme.card,
  }
}));