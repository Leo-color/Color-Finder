import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { Colors, Gradients, Spacing, BorderRadius, Shadows, Typography } from '../theme';
import { SolveStep } from '../utils/mathSolver';
import { RootStackParamList } from '../navigation/AppNavigator';

type ResultRoute = RouteProp<RootStackParamList, 'Result'>;

const { width } = Dimensions.get('window');

// ─── Step Card ─────────────────────────────────────────────────────────────────
function StepCard({
  step,
  index,
  delay,
}: {
  step: SolveStep;
  index: number;
  delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.stepCard,
        step.highlight && styles.stepCardHighlight,
        { opacity: anim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepDescription}>{step.description}</Text>
        <Text style={styles.stepExpression}>{step.expression}</Text>
        <Text
          style={[styles.stepResult, step.highlight && styles.stepResultHighlight]}
        >
          = {step.result}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Main ResultScreen ──────────────────────────────────────────────────────────
export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute<ResultRoute>();
  const insets = useSafeAreaInsets();
  const { result } = route.params;

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const resultScaleAnim = useRef(new Animated.Value(0.5)).current;
  const resultOpacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(
      result.error
        ? Haptics.NotificationFeedbackType.Error
        : Haptics.NotificationFeedbackType.Success
    );

    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(resultScaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(resultOpacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, []);

  const handleShare = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const steps =
      result.steps.length > 0
        ? '\n\nSteps:\n' +
          result.steps.map((s, i) => `${i + 1}. ${s.description}: ${s.expression} = ${s.result}`).join('\n')
        : '';

    const msg =
      `${result.isEquation ? '🔢 Equation Solved!' : '🧮 Math Solved!'}\n\n` +
      `Expression: ${result.cleaned}\n` +
      `Answer: ${result.result}` +
      steps +
      '\n\n📲 Solved with Solvix Math - Free Math Solver';

    await Share.share({ message: msg });
  }, [result]);

  const handleSolveAnother = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const isError = !!result.error && result.result === 'Error';
  const resultColor = isError ? Colors.error : Colors.accentGreen;

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, opacity: headerAnim },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={handleSolveAnother}>
          <Ionicons name="chevron-down" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {result.isEquation ? 'Equation Solved' : 'Expression Solved'}
        </Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={Colors.accent} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Hero Card */}
        <Animated.View
          style={[
            styles.resultCard,
            {
              opacity: resultOpacityAnim,
              transform: [{ scale: resultScaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={isError ? ['#2A0A1A', '#1A0A0A'] : ['#0A2A1A', '#0A1A2A']}
            style={styles.resultCardGrad}
          >
            {/* Icon */}
            <Animated.View style={{ opacity: glowAnim }}>
              <MaterialCommunityIcons
                name={isError ? 'alert-circle' : 'check-circle'}
                size={40}
                color={resultColor}
              />
            </Animated.View>

            {/* Original expression */}
            <View style={styles.expressionBadge}>
              <Text style={styles.expressionLabel}>Expression</Text>
              <Text style={styles.expressionText} numberOfLines={3} adjustsFontSizeToFit>
                {result.cleaned}
              </Text>
            </View>

            {/* Big result */}
            <View style={styles.resultRow}>
              <Text style={styles.equalsLabel}>=</Text>
              <Text
                style={[styles.resultText, { color: resultColor }]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {result.result}
              </Text>
            </View>

            {isError && (
              <Text style={styles.errorText}>{result.error}</Text>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Steps section */}
        {result.steps.length > 1 && (
          <View style={styles.stepsSection}>
            <View style={styles.stepsSectionHeader}>
              <MaterialCommunityIcons
                name="format-list-numbered"
                size={20}
                color={Colors.accent}
              />
              <Text style={styles.stepsSectionTitle}>Step-by-Step Solution</Text>
            </View>

            {result.steps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                delay={index * 80 + 400}
              />
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryAction} onPress={handleSolveAnother}>
            <LinearGradient colors={Gradients.button} style={styles.primaryActionGrad}>
              <Ionicons name="camera" size={22} color={Colors.text} />
              <Text style={styles.primaryActionText}>Solve Another</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={handleShare}>
            <Ionicons name="share-social" size={20} color={Colors.accent} />
            <Text style={styles.secondaryActionText}>Share Result</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
  },
  headerTitle: {
    ...Typography.h3,
    fontSize: 17,
  },
  shareBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.lg, gap: Spacing.lg },
  // Result card
  resultCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.lg,
  },
  resultCardGrad: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  expressionBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  expressionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  expressionText: {
    ...Typography.math,
    fontSize: 22,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  equalsLabel: {
    fontSize: 36,
    fontWeight: '300',
    color: Colors.textSecondary,
  },
  resultText: {
    ...Typography.result,
    textAlign: 'center',
    maxWidth: width - 100,
  },
  errorText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Steps
  stepsSection: { gap: Spacing.sm },
  stepsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  stepsSectionTitle: {
    ...Typography.h3,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepCardHighlight: {
    borderColor: Colors.accent,
    backgroundColor: 'rgba(0, 212, 255, 0.06)',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stepContent: { flex: 1, gap: 3 },
  stepDescription: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  stepExpression: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  stepResult: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  stepResultHighlight: {
    color: Colors.accentGreen,
    fontSize: 18,
    fontWeight: '700',
  },
  // Actions
  actions: { gap: Spacing.sm, marginTop: Spacing.md },
  primaryAction: {
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
    ...Shadows.md,
  },
  primaryActionGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md + 2,
  },
  primaryActionText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.round,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
  },
});
