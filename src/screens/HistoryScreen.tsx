import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { Colors, Gradients, Spacing, BorderRadius, Shadows, Typography } from '../theme';
import { useHistory, HistoryEntry } from '../hooks/useHistory';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

function formatTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'Just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function HistoryItem({
  item,
  onPress,
  onDelete,
}: {
  item: HistoryEntry;
  onPress: () => void;
  onDelete: () => void;
}) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, tension: 300 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 300 }).start();
  };

  const isError = !!item.error && item.result === 'Error';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.historyItem}>
          <View style={[styles.typeIcon, item.isEquation && styles.typeIconEq]}>
            <MaterialCommunityIcons
              name={item.isEquation ? 'function-variant' : 'calculator'}
              size={18}
              color={item.isEquation ? Colors.primaryLight : Colors.accent}
            />
          </View>

          <View style={styles.historyContent}>
            <Text style={styles.historyExpression} numberOfLines={1}>
              {item.cleaned}
            </Text>
            <Text
              style={[styles.historyResult, isError && { color: Colors.error }]}
              numberOfLines={1}
            >
              = {item.result}
            </Text>
            <Text style={styles.historyTime}>{formatTime(item.timestamp)}</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function StatCard({ label, value, icon, color }: {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor: color + '40' }]}>
      <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { history, loading, removeEntry, clearHistory, stats } = useHistory();

  const handleItemPress = useCallback(
    (item: HistoryEntry) => {
      Haptics.selectionAsync();
      navigation.navigate('Result', { result: item, imageUri: item.imageUri });
    },
    [navigation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      removeEntry(id);
    },
    [removeEntry]
  );

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Delete all solved problems? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            clearHistory();
          },
        },
      ]
    );
  }, [clearHistory]);

  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCard
          label="Total Solved"
          value={stats.totalSolved}
          icon="sigma"
          color={Colors.accent}
        />
        <StatCard
          label="Today"
          value={stats.todaySolved}
          icon="calendar-today"
          color={Colors.accentGreen}
        />
        <StatCard
          label="Equations"
          value={stats.equations}
          icon="function-variant"
          color={Colors.primaryLight}
        />
      </View>

      {/* Section header */}
      {history.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="calculator-variant-outline" size={72} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No History Yet</Text>
      <Text style={styles.emptySubtitle}>
        Scan a math expression with the camera to get started.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

      {/* Page title */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>History</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            onPress={() => handleItemPress(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={loading ? null : <EmptyState />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pageHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  pageTitle: {
    ...Typography.h1,
    fontSize: 28,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: 0,
  },
  listHeader: { gap: Spacing.lg, marginBottom: Spacing.lg },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textSecondary,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600',
  },
  // History item
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  typeIconEq: {
    backgroundColor: 'rgba(155, 126, 200, 0.1)',
  },
  historyContent: { flex: 1, gap: 2 },
  historyExpression: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  historyResult: {
    fontSize: 18,
    color: Colors.accentGreen,
    fontWeight: '700',
  },
  historyTime: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.round,
  },
  separator: { height: Spacing.sm },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
