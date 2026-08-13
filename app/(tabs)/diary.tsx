import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/components/useTheme';
import { addDays, formatFullDate, todayISO, weekdayShort, weekDates } from '@/lib/dates';
import { formatKcal } from '@/lib/format';
import { sumEntries } from '@/lib/nutrition';
import { useApp } from '@/store/AppProvider';

export default function DiaryScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { selectedDate, setDate, days, profile } = useApp();
  const week = weekDates(selectedDate);
  const today = todayISO();

  const weekLogs = week.map((date) => {
    const entries = days[date]?.entries ?? [];
    const calories = sumEntries(entries).calories;
    return { date, calories, logged: entries.length > 0 };
  });

  const loggedDays = weekLogs.filter((day) => day.logged);
  const weekAvg = loggedDays.length
    ? Math.round(loggedDays.reduce((sum, day) => sum + day.calories, 0) / loggedDays.length)
    : 0;

  const history = Object.keys(days)
    .sort((a, b) => (a < b ? 1 : -1))
    .filter((date) => (days[date]?.entries.length ?? 0) > 0)
    .slice(0, 21);

  const streak = (() => {
    let count = 0;
    let cursor = days[today]?.entries.length ? today : addDays(today, -1);
    while ((days[cursor]?.entries.length ?? 0) > 0) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  })();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Diary</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{formatKcal(weekAvg)}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Week avg</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{streak}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Day streak</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{loggedDays.length}/7</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Days logged</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>This week</Text>
        <View style={[styles.weekCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {weekLogs.map((day) => {
            const selected = day.date === selectedDate;
            const ratio = profile.calorieGoal <= 0 ? 0 : Math.min(day.calories / profile.calorieGoal, 1);
            const over = day.calories > profile.calorieGoal && day.logged;
            return (
              <Pressable key={day.date} onPress={() => setDate(day.date)} style={styles.weekDay}>
                <Text style={[styles.weekLabel, { color: selected ? colors.tint : colors.muted }]}>
                  {weekdayShort(day.date)}
                </Text>
                <View style={[styles.barTrack, { backgroundColor: colors.ringTrack }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(ratio * 100, day.logged ? 8 : 0)}%`,
                        backgroundColor: over ? colors.over : selected ? colors.tint : colors.carbs,
                      },
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: selected ? colors.tint : 'transparent',
                      borderColor: selected ? colors.tint : colors.border,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>History</Text>
        {history.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No days logged yet</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>
              Meals you add on Today will show up here with weekly averages and streaks.
            </Text>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {history.map((date, index) => {
              const entries = days[date]?.entries ?? [];
              const macros = sumEntries(entries);
              return (
                <Pressable
                  key={date}
                  onPress={() => {
                    setDate(date);
                    router.push('/');
                  }}
                  style={[
                    styles.historyRow,
                    index < history.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                    },
                  ]}>
                  <View>
                    <Text style={[styles.historyTitle, { color: colors.text }]}>{formatFullDate(date)}</Text>
                    <Text style={[styles.historyMeta, { color: colors.muted }]}>
                      {entries.length} items · P {Math.round(macros.protein)} · C {Math.round(macros.carbs)} · F{' '}
                      {Math.round(macros.fat)}
                    </Text>
                  </View>
                  <Text style={[styles.historyKcal, { color: colors.text }]}>{formatKcal(macros.calories)}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  content: {
    padding: 20,
    gap: 14,
    paddingBottom: 32,
  },
  summary: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 18,
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  weekCard: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  weekLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  barTrack: {
    width: 18,
    height: 88,
    borderRadius: 9,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 9,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  historyMeta: {
    fontSize: 12,
    marginTop: 3,
  },
  historyKcal: {
    fontSize: 16,
    fontWeight: '800',
  },
});
