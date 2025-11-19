# AmongStuds

A minimalist anonymous forum platform built with React and Firebase, enabling students to share thoughts, engage in discussions, and connect through anonymous posts and comments.

<!-- ![AmongStuds Banner](public/bg.png) -->

## 🌟 Features

### Core Functionality
- **Anonymous Posting**: Create posts with titles, content, and custom tags while maintaining anonymity
- **Real-time Updates**: Instant synchronization of posts and comments across all users
- **Interactive Engagement**: Like/dislike system with conflict resolution to prevent simultaneous actions
- **Comment Threading**: Nested comment system for engaging discussions
- **Content Moderation**: Report inappropriate content or delete posts (admin only)
- **Tag System**: Organize and categorize posts with custom tags

### User Management
- **Firebase Authentication**: Secure email/password authentication
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Account Approval Workflow**: New users require admin approval before full access
- **Protected Routes**: Secure pages accessible only to authenticated users

### UI/UX
- **Modern Dark Theme**: Sleek interface with custom color palette
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **Smooth Transitions**: Hover effects and animations for better user experience
- **Real-time Counters**: Live like counts and comment counts on posts

## 🛠 Tech Stack

**Frontend:**
- React 18 with Hooks
- React Router v6 for navigation
- Tailwind CSS for styling
- Vite for build tooling

**Backend:**
- Firebase Authentication
- Cloud Firestore (NoSQL database)
- Firebase Storage

**Development Tools:**
- Prettier for code formatting
- VS Code tasks for development workflow

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) account and project

## 🚀 Setup & Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd AmongStuds
```

### 2. Install Dependencies
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies (if applicable)
cd ../server
npm install
```

### 3. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password provider)
3. Create a **Firestore Database** in production mode
4. Enable **Firebase Storage**
5. Copy your Firebase config credentials

### 4. Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firestore Security Rules

Set up the following security rules in your Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
      
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
  }
}
```

### 6. Initialize First Admin User

After creating your first account, manually update the user document in Firestore:
1. Go to Firestore Console
2. Navigate to `users` collection
3. Find your user document
4. Add field: `role: 1` (1 = admin, 0 = regular user)
5. Add field: `status: "active"`

## 🏃 Running the Application

### Development Mode

**Option 1: Manual Start**
```bash
# Terminal 1 - Start React client
cd client
npm run dev
# Client runs on http://localhost:5173

# Terminal 2 - Start server (if applicable)
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Option 2: VS Code Task**
1. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac)
2. Type "Run Task"
3. Select "Start Fullstack"

### Production Build

```bash
cd client
npm run build
npm run preview
```

## 📁 Project Structure

```
AmongStuds/
├── client/
│   ├── public/
│   │   ├── AMONGSTUD_LOGO.png
│   │   └── bg.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreatePost.jsx      # Post creation form
│   │   │   ├── ForumHeader.jsx     # Navigation header
│   │   │   ├── PostCard.jsx        # Post display component
│   │   │   └── ProtectedRoute.jsx  # Route authentication wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── pages/
│   │   │   ├── ForumMain.jsx       # Main forum feed
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Post.jsx            # Individual post detail
│   │   │   └── Signup.jsx          # Registration page
│   │   ├── firebase.js             # Firebase configuration
│   │   ├── main.jsx                # App entry point
│   │   └── index.css               # Global styles
│   ├── .env                        # Environment variables
│   └── package.json
└── server/                         # Backend (if applicable)
```

## 🗄 Database Schema

### Users Collection
```javascript
{
  email: string,
  role: number,        // 0 = user, 1 = admin
  status: string,      // "pending" | "active" | "suspended"
  createdAt: timestamp
}
```

### Posts Collection
```javascript
{
  title: string,
  content: string,
  tags: array,
  user_id: string,
  createdAt: timestamp,
  likes: number,
  commentCount: number,
  likers: object,      // { userId: boolean }
  dislikers: object,   // { userId: boolean }
  reporters: object    // { userId: boolean }
}
```

### Comments Subcollection (nested under posts)
```javascript
{
  text: string,
  user_id: string,
  createdAt: timestamp
}
```

## 🎨 Key Features Implementation

### Real-time Updates
Uses Firestore's `onSnapshot` for live data synchronization:
```javascript
onSnapshot(q, (snap) => {
  setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
});
```

### Transaction-based Like System
Prevents race conditions using Firestore transactions:
```javascript
await runTransaction(db, async (tx) => {
  const snap = await tx.get(postRef);
  const data = snap.data();
  // Update logic with atomic operations
  tx.update(postRef, updates);
});
```

## 🔐 Security Features

- **Authentication Required**: All routes except login/signup are protected
- **Role-Based Access**: Admin-only features (delete posts)
- **User Anonymity**: Only partial user IDs displayed (first 6 characters)
- **Content Moderation**: Report system for inappropriate content
- **Account Approval**: New users require admin activation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

This project uses [Prettier](https://prettier.io/) for consistent code formatting. Format your code before committing:

```bash
npm run format
```

## 🐛 Known Issues

- Server folder exists but may not be fully implemented (check if Express backend is needed)
- Comment count increments but doesn't decrement on comment deletion
- No search functionality currently implemented

## 🚀 Future Enhancements

- [ ] Search functionality for posts and tags
- [ ] User profile pages
- [ ] Direct messaging between users
- [ ] Image/file uploads in posts
- [ ] Notification system
- [ ] Post bookmarking
- [ ] Advanced filtering and sorting options
- [ ] Dark/light theme toggle

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

Ron Patrick Ramas - [MrChooey](https://github.com/MrChooey)

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Tailwind CSS for styling utilities
- React team for the amazing framework
- Vite for lightning-fast development experience

---

**Made with ❤️ by students, for students**