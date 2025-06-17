import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';

function formatDate(iso) {
  if (!iso) return 'N/A';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

function formatDateForComparison(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const { tasks, toggleTaskDone } = useTasks();
  const selectedDateStr = formatDateForComparison(selectedDate);
  const tasksForDate = tasks.filter(task => task.dueDate === selectedDateStr);

  const renderCalendarHeader = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={styles.calendarHeader}>
        {days.map((day) => (
          <Text key={day} style={styles.calendarHeaderText}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderCalendarDays = () => {
    // This is a simplified version - we'll implement the full calendar logic later
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
      <View style={styles.calendarGrid}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.calendarDay,
              selectedDate.getDate() === day && styles.selectedDay,
            ]}
            onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
          >
            <Text
              style={[
                styles.calendarDayText,
                selectedDate.getDate() === day && styles.selectedDayText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity style={styles.taskCard} onPress={() => toggleTaskDone(item.id)}>
      <Text style={[styles.taskTitle, item.done && styles.taskDone]}>
        {item.title} {item.done ? '✔️' : ''}
      </Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      <Text style={styles.taskPoints}>Points: {item.points}</Text>
      <Text style={styles.taskAssignee}>Assigned to: {item.assignee || 'Unassigned'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>

      <View style={styles.calendarContainer}>
        {renderCalendarHeader()}
        {renderCalendarDays()}
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Tasks for {formatDate(selectedDateStr)}</Text>
        {tasksForDate.length === 0 ? (
          <View style={styles.emptyEvents}>
            <Text style={styles.emptyText}>No tasks scheduled</Text>
          </View>
        ) : (
          <FlatList
            data={tasksForDate}
            renderItem={renderTask}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
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
  calendarContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  calendarHeaderText: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  selectedDayText: {
    color: 'white',
  },
  eventsContainer: {
    flex: 1,
    padding: 15,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyEvents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDescription: {
    color: '#666',
    marginBottom: 4,
  },
  taskPoints: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  taskAssignee: {
    color: '#666',
    fontSize: 12,
  },
}); 