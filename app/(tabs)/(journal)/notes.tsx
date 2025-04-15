import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { PenLine, Save, X } from 'lucide-react-native';
import { useTheme, createThemedStyles } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

type Note = {
  id: string;
  content: string;
  created_at: string;
};

export default function NotesScreen() {
  const { isDark } = useTheme();
  const styles = themedStyles(isDark);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    // Set editing mode to true when navigating to this screen
    setIsEditing(true);
  }, []);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('quick_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('quick_notes')
        .insert({
          user_id: user.id,
          content: newNote.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setNotes([data, ...notes]);
      setNewNote('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {isEditing ? (
        <View style={styles.editorContainer}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>New Note</Text>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setIsEditing(false)}>
              <X size={24} color={isDark ? '#94a3b8' : '#64748b'} />
            </Pressable>
          </View>
          
          <TextInput
            style={styles.noteInput}
            multiline
            placeholder="Write your thoughts..."
            value={newNote}
            onChangeText={setNewNote}
            autoFocus
          />
          
          <Pressable 
            style={[styles.saveButton, !newNote.trim() && styles.saveButtonDisabled]}
            onPress={handleSaveNote}
            disabled={!newNote.trim()}>
            <Save size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Note</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <Pressable 
            style={styles.addNoteButton}
            onPress={() => setIsEditing(true)}>
            <PenLine size={20} color="#6366f1" />
            <Text style={styles.addNoteText}>Add Quick Note</Text>
          </Pressable>

          <View style={styles.notesList}>
            {notes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <Text style={styles.noteContent}>{note.content}</Text>
                <Text style={styles.noteDate}>{formatDate(note.created_at)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.border,
    borderStyle: 'dashed',
    marginBottom: 24,
    gap: 8,
  },
  addNoteText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#6366f1',
  },
  notesList: {
    gap: 16,
  },
  noteCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  noteContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  noteDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.subtext,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: theme.card,
    padding: 16,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  editorTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: theme.text,
  },
  closeButton: {
    padding: 8,
  },
  noteInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.card,
  },
}));