import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Search, Sparkles } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { ProgramCard } from './ProgramCard';

type Program = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_days: number;
  theme: string;
};

const categories = [
  { id: 'love', name: 'Love', color: '#f472b6', description: 'Nurture relationships and self-love' },
  { id: 'healing', name: 'Healing', color: '#34d399', description: 'Journey through emotional healing' },
  { id: 'anxiety', name: 'Anxiety', color: '#60a5fa', description: 'Manage anxiety and find calm' },
  { id: 'anger', name: 'Anger', color: '#f43f5e', description: 'Transform anger into understanding' },
  { id: 'hope', name: 'Hope', color: '#fbbf24', description: 'Cultivate optimism and resilience' },
  { id: 'depression', name: 'Depression', color: '#818cf8', description: 'Navigate through dark times' },
  { id: 'fear', name: 'Fear', color: '#94a3b8', description: 'Face and overcome your fears' },
  { id: 'peace', name: 'Peace', color: '#2dd4bf', description: 'Find inner peace and tranquility' },
];

export function FindPlansTab() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, [selectedCategory]);

  const fetchPrograms = async () => {
    try {
      let query = supabase
        .from('programs')
        .select('*')
        .order('created_at');

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={isDark ? '#94a3b8' : '#64748b'} />
        <Text style={styles.searchPlaceholder}>Search programs...</Text>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Emotional Wellness Programs</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryCard,
                { backgroundColor: `${category.color}20` }
              ]}
              onPress={() => setSelectedCategory(
                category.id === selectedCategory ? null : category.id
              )}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Sparkles size={24} color="#fff" />
              </View>
              <Text style={[styles.categoryName, { color: category.color }]}>
                {category.name}
              </Text>
              <Text style={styles.categoryDescription}>
                {category.description}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.programsSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory 
            ? `${categories.find(c => c.id === selectedCategory)?.name} Programs`
            : 'All Programs'
          }
        </Text>
        
        {loading ? (
          <Text style={styles.loadingText}>Loading programs...</Text>
        ) : (
          programs.map(program => (
            <ProgramCard key={program.id} {...program} />
          ))
        )}
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 8,
  },
  searchPlaceholder: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
    flex: 1,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.text,
    marginBottom: 16,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContent: {
    gap: 16,
  },
  categoryCard: {
    width: 200,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    marginRight: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  categoryDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.subtext,
    lineHeight: 20,
  },
  programsSection: {
    marginBottom: 24,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
  },
}));