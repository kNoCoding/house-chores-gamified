import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';

export default function HomeScreen() {
  const { tasks } = useTasks();
  const today = new Date().toISOString().slice(0, 10);
  
  // Get all tasks completed today, regardless of due date
  const tasksCompletedToday = tasks.filter(task => {
    if (!task.done) return false;
    const completedDate = new Date(task.completedAt).toISOString().slice(0, 10);
    return completedDate === today;
  });

  // Get tasks due today
  const todaysTasks = tasks.filter(task => task.dueDate === today);
  
  // Get overdue tasks and tasks without due dates
  const overdueTasks = tasks.filter(task => {
    if (task.done || !task.dueDate) return false;
    return task.dueDate < today;
  });

  const noDueDateTasks = tasks.filter(task => !task.done && !task.dueDate);
  
  // Calculate points from all tasks completed today
  const pointsToday = tasksCompletedToday.reduce((sum, t) => sum + (t.points || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to ChoreQuest!</Text>
          <Text style={styles.subtitle}>Let's make chores fun!</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pointsToday}</Text>
            <Text style={styles.statLabel}>Points Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasksCompletedToday.length}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          {todaysTasks.length === 0 ? (
            <Text style={styles.emptyText}>No tasks due today</Text>
          ) : (
            todaysTasks.map(task => (
              <Text key={task.id} style={[styles.taskItem, task.done && styles.taskDone]}>
                {task.title} {task.done ? '✔️' : ''}
              </Text>
            ))
          )}
        </View>

        {(overdueTasks.length > 0 || noDueDateTasks.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Tasks</Text>
            {overdueTasks.map(task => (
              <Text key={task.id} style={[styles.taskItem, styles.overdueTask]}>
                {task.title} (Due: {new Date(task.dueDate).toLocaleDateString()})
              </Text>
            ))}
            {noDueDateTasks.map(task => (
              <Text key={task.id} style={styles.taskItem}>
                {task.title} (No due date)
              </Text>
            ))}
          </View>
        )}

        {tasksCompletedToday.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Today</Text>
            {tasksCompletedToday.map(task => (
              <Text key={task.id} style={[styles.taskItem, styles.taskDone]}>
                {task.title} ✔️
                {task.dueDate !== today && (
                  <Text style={styles.taskDueDate}> (Due: {new Date(task.dueDate).toLocaleDateString()})</Text>
                )}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  taskItem: {
    fontSize: 16,
    marginBottom: 6,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDueDate: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  overdueTask: {
    color: '#d32f2f',
  },
}); 