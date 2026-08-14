import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { personas, Intensity } from '../../src/constants/personas';
import { useAppState } from '../../src/context/AppContext';
import { pulsePresence, startBodyPattern } from '../../src/lib/haptics';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

function personalizeOpening(opening: string, name?: string) {
  if (!name) return opening;
  return `${name}. ${opening}`;
}

export default function WhisperSessionScreen() {
  const { scenarioId, intensity, firstSession } = useLocalSearchParams<{
    scenarioId: string;
    intensity: Intensity;
    firstSession?: string;
  }>();
  const router = useRouter();
  const { decrementFreeSession, self, setHasCompletedFirstSession } = useAppState();
  const elena = personas[0];
  const scenario = elena.scenarios.find((s) => s.id === scenarioId) ?? elena.scenarios[0];
  const isFirstSession = firstSession === '1';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: personalizeOpening(scenario.openingLine, self?.name),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bodyOn, setBodyOn] = useState(true);
  const hasStarted = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const stopBodyRef = useRef<(() => void) | null>(null);
  const sessionIntensity: Intensity = intensity ?? 'warm';

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      decrementFreeSession();
      pulsePresence(sessionIntensity);
    }
  }, [decrementFreeSession, sessionIntensity]);

  useEffect(() => {
    stopBodyRef.current?.();
    stopBodyRef.current = null;
    if (bodyOn) {
      stopBodyRef.current = startBodyPattern(sessionIntensity);
    }
    return () => {
      stopBodyRef.current?.();
      stopBodyRef.current = null;
    };
  }, [bodyOn, sessionIntensity]);

  const handleLeave = () => {
    if (isFirstSession) {
      setHasCompletedFirstSession(true);
      router.replace('/(tabs)');
      return;
    }
    router.back();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    // Placeholder: will be replaced by whisper-chat edge function
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const placeholderResponses = [
      "Mmm. Tell me more about that. I want to hear every detail.",
      "I like the way you think. What would you do if no one was watching?",
      "You're making this interesting. Don't stop now.",
      "I can almost feel the tension between us. What happens next?",
    ];

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: placeholderResponses[messages.length % placeholderResponses.length],
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsThinking(false);
    pulsePresence(sessionIntensity);
  };

  return (
    <LinearGradient colors={['#1A1218', '#0D0B0E']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleLeave} hitSlop={12}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.personaName}>{elena.name}</Text>
            <Text style={styles.scenarioTitle}>
              {scenario.title}
              {self?.name ? ` · ${self.name}` : ''}
            </Text>
          </View>
          <Pressable onPress={() => setBodyOn((prev) => !prev)} hitSlop={12}>
            <Text style={[styles.bodyToggleText, bodyOn && styles.bodyToggleTextOn]}>
              Body {bodyOn ? 'on' : 'off'}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' && styles.userMessageText,
                ]}
              >
                {message.content}
              </Text>
            </View>
          ))}

          {isThinking && (
            <View style={styles.thinkingBubble}>
              <Text style={styles.thinkingText}>listening...</Text>
            </View>
          )}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputArea}
        >
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your response..."
            placeholderTextColor={colors.textSubtle}
            multiline
            maxLength={500}
          />

          <View style={styles.inputActions}>
            <Pressable
              onPressIn={() => setIsRecording(true)}
              onPressOut={() => {
                setIsRecording(false);
                // Voice recording will connect to STT in Phase 2
              }}
              style={[styles.micButton, isRecording && styles.micButtonActive]}
            >
              <Text style={styles.micIcon}>{isRecording ? '●' : '◉'}</Text>
            </Pressable>

            <Pressable
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isThinking}
              style={[styles.sendButton, (!inputText.trim() || isThinking) && styles.sendDisabled]}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeText: {
    ...typography.link,
    color: colors.textMuted,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  personaName: {
    ...typography.subtitle,
    color: colors.whisper,
    fontSize: 16,
  },
  scenarioTitle: {
    ...typography.caption,
    color: colors.textSubtle,
    textTransform: 'none',
    letterSpacing: 0,
  },
  bodyToggleText: {
    ...typography.link,
    color: colors.textSubtle,
    fontSize: 13,
  },
  bodyToggleTextOn: {
    color: colors.text,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 18,
    padding: 14,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.whisperMuted,
    borderBottomRightRadius: 4,
  },
  messageText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.text,
  },
  thinkingBubble: {
    alignSelf: 'flex-start',
    padding: 12,
  },
  thinkingText: {
    ...typography.caption,
    color: colors.whisper,
    fontStyle: 'italic',
    textTransform: 'none',
    letterSpacing: 0,
  },
  inputArea: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    backgroundColor: colors.surface,
  },
  textInput: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    maxHeight: 100,
    marginBottom: 12,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    borderColor: colors.whisper,
    backgroundColor: 'rgba(184, 125, 158, 0.2)',
  },
  micIcon: {
    fontSize: 18,
    color: colors.whisper,
  },
  sendButton: {
    flex: 1,
    backgroundColor: colors.whisper,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
});
