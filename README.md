# House Chores Gamified

A mobile application that gamifies house chores, making household tasks more engaging and fun for families.

## Features (Planned)

- Task management and assignment
- Family member profiles and roles
- Points and rewards system
- Calendar integration
- Push notifications
- Camera integration for task verification
- Family group management
- Progress tracking and statistics

## Tech Stack

- Frontend: React Native with Expo
- Backend: Node.js with Express
- Database: MongoDB (free tier)
- Authentication: Firebase Authentication
- Push Notifications: Expo Notifications
- Calendar Integration: Expo Calendar
- Camera: Expo Camera
- Deployment: 
  - Frontend: Expo EAS Build
  - Backend: Render (free tier)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```

## Development Status

🚧 Under Development ��

## License

MIT 

## Changelog

### feature/profile-stats
- ProfileScreen now shows real stats:
  - Total tasks completed
  - Tasks completed this week
  - Streak (consecutive days with at least one task done)
- Added ProfileContext for user name and avatar (local-only)
- User can edit their name from ProfileScreen
- UI improvements for stats and editing
- All data is local-only (no backend yet) 