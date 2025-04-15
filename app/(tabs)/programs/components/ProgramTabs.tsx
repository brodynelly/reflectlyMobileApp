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
    borderBottomWidth: 0.5,
    borderBottomColor: theme.border
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: theme.background,
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