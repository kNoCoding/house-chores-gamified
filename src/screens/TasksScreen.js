import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Platform, Button, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../context/TaskContext';

function formatDate(iso) {
  if (!iso) return 'N/A';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export default function TasksScreen() {
  const { tasks, addTask, deleteTask, toggleTaskDone, updateTask } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: new Date(),
    points: '', 
    assignee: '' 
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const resetTaskState = () => {
    setNewTask({ 
      title: '', 
      description: '', 
      dueDate: new Date(),
      points: '', 
      assignee: '' 
    });
    setEditMode(false);
    setEditTaskId(null);
  };

  const openAddModal = () => {
    resetTaskState();
    setModalVisible(true);
  };

  const openEditModal = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      points: String(task.points),
      assignee: task.assignee || '',
    });
    setEditMode(true);
    setEditTaskId(task.id);
    setModalVisible(true);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Validation', 'Task title is required.');
      return;
    }
    addTask({
      ...newTask,
      points: newTask.points === '' ? 10 : parseInt(newTask.points) || 10,
    });
    resetTaskState();
    setModalVisible(false);
  };

  const handleEditTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Validation', 'Task title is required.');
      return;
    }
    updateTask(editTaskId, {
      ...newTask,
      points: newTask.points === '' ? 10 : parseInt(newTask.points) || 10,
    });
    resetTaskState();
    setModalVisible(false);
  };

  const handleCancel = () => {
    resetTaskState();
    setModalVisible(false);
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, item.done && styles.taskCardDone]}>
      <TouchableOpacity onPress={() => toggleTaskDone(item.id)} style={styles.checkCircle}>
        <Text style={styles.checkMark}>{item.done ? '✔️' : ''}</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>{item.title}</Text>
          <Text style={styles.taskPoints}>+{item.points} pts</Text>
        </View>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <View style={styles.taskFooter}>
          <Text style={styles.taskDueDate}>
            Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'}
          </Text>
          <Text style={styles.taskAssignee}> • Assigned to: {item.assignee || 'Unassigned'}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => openEditModal(item)} style={{ marginLeft: 6, padding: 6 }}>
        <Text style={{ fontSize: 18, color: '#2196F3' }}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>Add your first task to get started!</Text>
          </View>
        }
      />

      {/* Add/Edit Task Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flex: 1 }}
              keyboardVerticalOffset={0}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{editMode ? 'Edit Task' : 'Add New Task'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={newTask.title}
                  onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <TextInput
                  style={[styles.input, { height: 60 }]}
                  placeholder="Description"
                  value={newTask.description}
                  onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                  multiline
                  returnKeyType="default"
                  blurOnSubmit={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Assignee (optional)"
                  value={newTask.assignee}
                  onChangeText={(text) => setNewTask({ ...newTask, assignee: text })}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <View style={[styles.dateSection, { marginBottom: 12 }]}>
                  <View style={styles.dateToggleContainer}>
                    <Text style={styles.dateToggleLabel}>Due Date</Text>
                    <TouchableOpacity 
                      onPress={() => {
                        if (newTask.dueDate === null) {
                          // If currently "No Due Date", switch to today's date
                          const today = new Date();
                          setNewTask({ ...newTask, dueDate: today });
                        } else {
                          // If currently has a date, switch to no date
                          setNewTask({ ...newTask, dueDate: null });
                        }
                      }} 
                      style={[
                        styles.dateToggle,
                        { backgroundColor: newTask.dueDate === null ? '#f0f0f0' : '#4CAF50' }
                      ]}
                    >
                      <View style={[
                        styles.dateToggleKnob,
                        { transform: [{ translateX: newTask.dueDate === null ? 0 : 20 }] }
                      ]} />
                    </TouchableOpacity>
                  </View>
                  {newTask.dueDate !== null && (
                    <TouchableOpacity 
                      onPress={() => setShowDatePicker(true)}
                      style={[styles.dateButton, { backgroundColor: '#e8f5e9' }]}
                    >
                      <Text style={styles.dateButtonText}>
                        {newTask.dueDate ? `Due: ${newTask.dueDate.toLocaleDateString()}` : 'Select Date'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {showDatePicker && newTask.dueDate !== null && (
                  <View style={{ marginBottom: 12 }}>
                    <DateTimePicker
                      value={newTask.dueDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          const date = new Date(selectedDate);
                          setNewTask({ ...newTask, dueDate: date });
                        }
                      }}
                    />
                  </View>
                )}
                <TextInput
                  style={[styles.input, { width: '100%' }]}
                  placeholder="Points"
                  keyboardType="numeric"
                  value={newTask.points === '' ? '' : String(newTask.points)}
                  onChangeText={(text) => setNewTask({ ...newTask, points: text.replace(/[^0-9]/g, '') })}
                  maxLength={3}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <View style={styles.modalActions}>
                  <Button title="Cancel" color="#888" onPress={handleCancel} />
                  <Button
                    title={editMode ? 'Save Changes' : 'Add Task'}
                    color="#4CAF50"
                    onPress={editMode ? handleEditTask : handleAddTask}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCardDone: {
    opacity: 0.5,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkMark: {
    fontSize: 18,
    color: '#4CAF50',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskPoints: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  taskDescription: {
    color: '#666',
    marginBottom: 10,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  taskDueDate: {
    color: '#666',
    fontSize: 12,
  },
  taskAssignee: {
    color: '#666',
    fontSize: 12,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 6,
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'red',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4CAF50',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateSection: {
    gap: 8,
  },
  dateToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dateToggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  dateToggle: {
    width: 50,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  dateToggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dateButton: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 8,
  },
  dateButtonText: {
    color: '#388e3c',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
}); 