import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ChevronRight, Plus, Heart, X } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function GratitudeScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [gratitudeList, setGratitudeList] = useState(['']);
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) return null;

  const addGratitudeItem = () => {
    setGratitudeList([...gratitudeList, '']);
  };

  const updateGratitudeItem = (index: number, value: string) => {
    const newList = [...gratitudeList];
    newList[index] = value;
    setGratitudeList(newList);
  };

  const handleContinue = async () => {
    const filteredList = gratitudeList.filter(item => item.trim());
    if (filteredList.length > 0) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('journal_entries')
          .update({ gratitude: filteredList })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
      }
      router.push('/(daily)/challenges');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gratitude</Text>
          <Text style={styles.subtitle}>What are you thankful for today?</Text>
        </View>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#64748b" />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.gratitudeContainer}>
          {gratitudeList.map((item, index) => (
            <View key={index} style={styles.gratitudeItem}>
              <View style={styles.heartContainer}>
                <Heart size={20} color="#6366f1" style={styles.heartIcon} />
              </View>
              <TextInput
                style={styles.gratitudeInput}
                placeholder="I'm grateful for..."
                value={item}
                onChangeText={(value) => updateGratitudeItem(index, value)}
              />
            </View>
          ))}

          <Pressable style={styles.addButton} onPress={addGratitudeItem}>
            <Plus size={20} color="#6366f1" />
            <Text style={styles.addButtonText}>Add gratitude</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.continueButton,
            !gratitudeList.some(item => item.trim()) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!gratitudeList.some(item => item.trim())}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <ChevronRight size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.card,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: theme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.subtext,
  },
  gratitudeContainer: {
    gap: 16,
  },
  gratitudeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  heartContainer: {
    backgroundColor: theme.primaryBackground,
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  heartIcon: {
  },
  gratitudeInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
    gap: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.primary,
  },
  footer: {
    padding: 24,
    borderTopWidth: 0.5,
    borderTopColor: theme.border,
    backgroundColor: theme.card,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 18,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card,
  },
}));