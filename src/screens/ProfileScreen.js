import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../context/ProfileContext';
import { useTasks } from '../context/TaskContext';

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getStreak(tasks) {
  // Streak: consecutive days (ending today) with at least one task done
  const doneTasks = tasks.filter(t => t.done && t.dueDate);
  if (doneTasks.length === 0) return 0;
  const daysSet = new Set(doneTasks.map(t => t.dueDate));
  let streak = 0;
  let date = new Date();
  while (true) {
    const iso = date.toISOString().slice(0, 10);
    if (daysSet.has(iso)) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function ProfileScreen() {
  const { profile, updateName, updateAvatar } = useProfile();
  const { tasks } = useTasks();
  const [editModal, setEditModal] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  // Stats
  const totalCompleted = tasks.filter(t => t.done).length;
  
  // Get tasks completed this week (Monday to today)
  const monday = getMonday(new Date());
  const completedThisWeek = tasks.filter(t => {
    if (!t.done || !t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    return completedDate >= monday;
  }).length;

  const streak = getStreak(tasks);

  // Family members placeholder
  const [familyMembers, setFamilyMembers] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {profile.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Text style={styles.changeAvatarText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <TouchableOpacity onPress={() => setEditModal(true)} style={{ marginBottom: 10 }}>
              <Text style={{ color: '#4CAF50' }}>Edit Name</Text>
            </TouchableOpacity>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalCompleted}</Text>
                <Text style={[styles.statLabel, { textAlign: 'center' }]}>Tasks{'\n'}Done</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedThisWeek}</Text>
                <Text style={[styles.statLabel, { textAlign: 'center' }]}>Done{'\n'}This Week</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={[styles.statLabel, { textAlign: 'center' }]}>Day{'\n'}Streak</Text>
              </View>
            </View>
          </View>
        </View>

        <Modal visible={editModal} transparent animationType="slide" onRequestClose={() => setEditModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, width: '80%' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Edit Name</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 16 }}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Your name"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => setEditModal(false)} style={{ marginRight: 16 }}>
                  <Text style={{ color: '#888' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    updateName(nameInput.trim() || 'You');
                    setEditModal(false);
                  }}
                >
                  <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Members</Text>
          <TouchableOpacity style={styles.addFamilyButton}>
            <Text style={styles.addFamilyButtonText}>+ Add Family Member</Text>
          </TouchableOpacity>
          {familyMembers.length === 0 ? (
            <View style={styles.emptyFamily}>
              <Text style={styles.emptyText}>No family members added yet</Text>
              <Text style={styles.emptySubtext}>Add family members to start sharing chores!</Text>
            </View>
          ) : (
            <View style={styles.familyList}>
              {/* Family members list will go here */}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Help & Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, styles.logoutButton]}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
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
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addFamilyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addFamilyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyFamily: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  settingItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 