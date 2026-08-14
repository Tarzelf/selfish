import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNarrator } from '../audio/narrator';
import { GhostButton, PrimaryButton, Sanctuary } from '../components/ui';
import { assembleSession } from '../content/assemble';
import type { Profile } from '../types';
import { colors, space, type } from '../theme';

export function PlayerScreen({
  id,
  profile,
  onExit,
}: {
  id: string;
  profile: Profile;
  onExit: () => void;
}) {
  const assembled = useMemo(() => assembleSession(id, profile), [id, profile]);
  const narrator = useRef(createNarrator()).current;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const [ended, setEnded] = useState(false);

  const lines = assembled?.lines ?? [];
  const current = lines[index] ?? lines[lines.length - 1];

  const chapterForIndex = (lineIndex: number) => {
    if (!assembled) return undefined;
    let cursor = 0;
    for (const chapter of assembled.chapters) {
      const next = cursor + chapter.lines.length;
      if (lineIndex < next) return chapter;
      cursor = next;
    }
    return assembled.chapters[assembled.chapters.length - 1];
  };

  const chapter = chapterForIndex(index);
  const aftercareIndex = assembled
    ? assembled.chapters
        .slice(
          0,
          assembled.chapters.findIndex((item) => item.kind === 'aftercare'),
        )
        .reduce((sum, item) => sum + item.lines.length, 0)
    : 0;

  useEffect(() => {
    if (!assembled) return;
    let alive = true;
    narrator
      .prepare(assembled.lines, {
        voiceId: profile.voiceId,
        pace: profile.pace,
        onIndex: (next) => {
          if (alive) setIndex(next);
        },
        onEnd: () => {
          if (!alive) return;
          setPlaying(false);
          setEnded(true);
        },
      })
      .catch(() => undefined);
    return () => {
      alive = false;
      narrator.stop();
    };
  }, [assembled, narrator, profile.pace, profile.voiceId]);

  if (!assembled || !current) {
    return (
      <Sanctuary>
        <SafeAreaView style={styles.safe}>
          <Text style={type.body}>This listening is not available at your heat.</Text>
          <GhostButton label="Leave" onPress={onExit} />
        </SafeAreaView>
      </Sanctuary>
    );
  }

  const toggle = () => {
    if (playing) {
      narrator.pause();
      setPlaying(false);
      return;
    }
    narrator.play();
    setPlaying(true);
  };

  const report = () => {
    Alert.alert(
      'Thank you',
      'We will review this line. We do not keep a copy of what you reported on this device beyond this moment.',
    );
  };

  return (
    <Sanctuary>
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <GhostButton label="Leave quietly" onPress={onExit} />
          <GhostButton
            label={showText ? 'Hide words' : 'Show words'}
            onPress={() => setShowText((value) => !value)}
          />
        </View>
        <Text style={type.caption}>
          {assembled.session.title}
          {chapter ? ` · ${chapter.title}` : ''}
        </Text>
        <View style={styles.stage}>
          <Text style={styles.line}>
            {showText || playing || ended ? current.text : 'The room is dark. Press listen.'}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progress,
              { width: `${((index + 1) / lines.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.count}>
          {index + 1} / {lines.length}
        </Text>
        <PrimaryButton
          label={ended ? 'Listen again' : playing ? 'Pause' : 'Listen'}
          onPress={() => {
            if (ended) {
              setEnded(false);
              setIndex(0);
              narrator.skipTo(0);
              narrator.play();
              setPlaying(true);
              return;
            }
            toggle();
          }}
        />
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              narrator.skipTo(aftercareIndex);
              setIndex(aftercareIndex);
              if (!playing) {
                narrator.play();
                setPlaying(true);
              }
            }}
            style={styles.link}
          >
            <Text style={styles.linkText}>Skip to aftercare</Text>
          </Pressable>
          <Pressable onPress={report} style={styles.link}>
            <Text style={styles.linkText}>Report this line</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Sanctuary>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.xl,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: space.md,
  },
  stage: { flex: 1, justifyContent: 'center' },
  line: {
    ...type.serif,
    fontSize: 24,
    lineHeight: 36,
  },
  progressTrack: {
    height: 2,
    backgroundColor: colors.line,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: space.sm,
  },
  progress: {
    height: 2,
    backgroundColor: colors.gold,
  },
  count: { ...type.small, marginBottom: space.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.md,
  },
  link: { paddingVertical: 8 },
  linkText: { ...type.small, color: colors.gold },
});
