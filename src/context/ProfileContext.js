import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name: 'You',
    avatar: null, // Placeholder for avatar URI or null
  });

  const updateName = (name) => setProfile((prev) => ({ ...prev, name }));
  const updateAvatar = (avatar) => setProfile((prev) => ({ ...prev, avatar }));

  return (
    <ProfileContext.Provider value={{ profile, updateName, updateAvatar }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
} 