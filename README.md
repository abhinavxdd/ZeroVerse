# ZeroVerse 🌌

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%203%20Flash-orange?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

> An anonymous social platform designed exclusively for college students to share experiences, confessions, and connect with peers in a safe, judgment-free space.

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [AI Content Moderation](#-ai-content-moderation)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎭 **Anonymous Posting**

- Share thoughts, experiences, and confessions completely anonymously
- Auto-generated unique aliases using intelligent name combinations (e.g., "Silent Panda", "Mystic Tiger")
- No personal information ever exposed to other users
- Choose from 6 categories: General, Hostel, Exams, Gossip, Placements, Confessions

### 🤖 **AI-Powered Content Moderation**

Leveraging **Google Gemini 3 Flash AI**, every confession is automatically analyzed through our intelligent **Traffic Light System**:

- 🟢 **GREEN (Auto-Approve)**: Wholesome content, funny experiences, harmless confessions, study tips
- 🟡 **YELLOW (Manual Review)**: Borderline content, sarcasm, controversial opinions requiring human judgment
- 🔴 **RED (Auto-Reject)**: Hate speech, harassment, explicit content, threats, bullying, violence

**AI Advantages:**

- Real-time content analysis
- Context-aware moderation
- Reduces manual moderation workload by 80%
- Protects community safety 24/7

### 🔐 **Secure OTP Authentication**

- **College Email Verification**: Restricted to verified college emails (@nith.ac.in)
- **6-Digit OTP System**:
  - Sent via Nodemailer email service
  - 10-minute validity period
  - Required for signup and password reset
- **JWT Token Authentication**: 30-day secure sessions
- **Password Requirements**:
  - Minimum 12 characters
  - Bcrypt hashing with salt rounds
- **Forgot Password Flow**: Complete OTP-based password reset

### 📱 **Rich Media Support (Cloudinary)**

- **Image Uploads**:
  - Automatic optimization
  - Multiple format support (JPG, PNG, GIF)
  - Cloudinary CDN for fast delivery
- **Video Uploads**:
  - Automatic transcoding
  - Streaming optimization
- **Storage Management**:
  - Automatic cleanup of unused media
  - Efficient CDN-based delivery

### 🏆 **Leaderboard & Gamification**

- Top contributors ranked by:
  - Total posts created
  - Total likes received
  - Community engagement score
- Anonymous competition without revealing identities

### 🎨 **Modern UI/UX**

- Dark mode optimized design
- Fully responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Real-time search functionality
- Category-based filtering
- Infinite scroll feed

### 👥 **Social Features**

- Like/Dislike system
- Comment on posts
- User profiles with statistics
- Visitor counter
- Real-time notifications

## 🛠 Tech Stack

### Frontend

| Technology       | Purpose                         |
| ---------------- | ------------------------------- |
| **Next.js 14**   | React framework with App Router |
| **TailwindCSS**  | Utility-first CSS framework     |
| **Shadcn/ui**    | Beautiful component library     |
| **Lucide Icons** | Modern icon set                 |
| **Sonner**       | Toast notifications             |
| **Context API**  | State management                |

### Backend

| Technology               | Purpose                      |
| ------------------------ | ---------------------------- |
| **Node.js & Express.js** | Server framework             |
| **MongoDB & Mongoose**   | Database & ODM               |
| **JWT**                  | Token-based authentication   |
| **Bcrypt.js**            | Password hashing             |
| **Multer**               | File upload middleware       |
| **Cloudinary SDK**       | Media storage & optimization |
| **Nodemailer**           | Email service for OTP        |
| **Google Gemini AI**     | AI content moderation        |

## 🏗 Architecture

```
ZeroVerse/
│
├── client/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                    # App Router pages
│   │   │   ├── page.js            # Home feed
│   │   │   ├── login/             # Login page
│   │   │   ├── signup/            # Signup + OTP verification
│   │   │   ├── forgot-password/   # Password reset with OTP
│   │   │   ├── create/            # Create post with media
│   │   │   ├── confess/           # Anonymous confession
│   │   │   ├── confessions/       # Confessions feed
│   │   │   ├── post/[id]/         # Single post view
│   │   │   ├── profile/           # User profile & stats
│   │   │   ├── settings/          # Account settings
│   │   │   └── about/             # About & guidelines
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                # Shadcn components
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── Sidebar.jsx        # Side navigation
│   │   │   ├── Leaderboard.jsx    # Top users
│   │   │   ├── ConfessionCard.jsx # Post card component
│   │   │   ├── Footer.jsx         # Footer component
│   │   │   └── VisitorCounter.jsx # Analytics
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.js     # Authentication state
│   │   │   └── SearchContext.js   # Search state
│   │   │
│   │   └── lib/
│   │       ├── api.js             # API client
│   │       └── utils.js           # Utility functions
│   │
│   └── public/                     # Static assets
│
├── server/                          # Backend (Node.js)
│   ├── server.js                   # Express app entry
│   │
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary configuration
│   │
│   ├── controllers/
│   │   ├── authController.js      # Auth logic (OTP, JWT)
│   │   ├── postController.js      # Post CRUD operations
│   │   └── confessionController.js # AI moderation logic
│   │
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   │
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Post.js                # Post schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── postRoutes.js          # Post endpoints
│   │   └── confessionRoutes.js    # Confession endpoints
│   │
│   └── utils/
│       ├── aliasGenerator.js      # Anonymous name generator
│       └── emailService.js        # OTP email sender
│
└── README.md
```

## 🤖 AI Content Moderation

### Traffic Light System

ZeroVerse uses **Google Gemini 3 Flash AI** to automatically moderate all confessions before they go live.

#### How It Works:

1. **User submits confession** → AI analysis triggered
2. **Gemini AI analyzes** content for:
   - Hate speech & discrimination
   - Explicit content
   - Harassment & bullying
   - Violence & threats
   - Context & intent
3. **Classification**:
   ```javascript
   🟢 GREEN → Auto-approve & publish
   🟡 YELLOW → Queue for manual review
   🔴 RED → Auto-reject with feedback
   ```

#### Example Classifications:

**🟢 GREEN Examples:**

- "I finally aced my data structures exam!"
- "Anyone else think the hostel food is getting better?"
- "Shoutout to the library staff for being awesome"

**🟡 YELLOW Examples:**

- "The new attendance policy is ridiculous"
- "Why do some professors have favorites?"
- "Controversial opinion: [borderline topic]"

**🔴 RED Examples:**

- Any content containing hate speech
- Explicit sexual content
- Personal attacks or doxxing
- Threats or violence

### Benefits:

- ⚡ **Instant moderation** - No waiting for manual approval
- 🛡️ **24/7 protection** - AI never sleeps
- 🎯 **Accuracy** - Context-aware decisions
- 📊 **Scalable** - Handles unlimited submissions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account (for OTP emails)
- Google AI Studio API key (Gemini)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/zeroverse.git
cd zeroverse
```

2. **Install dependencies**

For the client:

```bash
cd client
npm install
```

For the server:

```bash
cd server
npm install
```

3. **Set up environment variables** (see next section)

4. **Start MongoDB**

```bash
# If using local MongoDB
mongod
```

5. **Run the development servers**

Terminal 1 (Backend):

```bash
cd server
npm start
```

Terminal 2 (Frontend):

```bash
cd client
npm run dev
```

6. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Environment Variables

### Client (.env.local)

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Server (.env)

Create `server/.env`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/zeroverse
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zeroverse

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Service (Nodemailer with Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
# Get app password: https://myaccount.google.com/apppasswords

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
# Get from: https://cloudinary.com/console

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
# Get from: https://aistudio.google.com/app/apikey

# Server
PORT=5000
NODE_ENV=development

# College Email Domain (for validation)
ALLOWED_EMAIL_DOMAIN=@nith.ac.in
```

### Getting API Keys:

**Cloudinary:**

1. Sign up at https://cloudinary.com
2. Go to Dashboard → API Keys
3. Copy Cloud Name, API Key, and API Secret

**Gmail App Password:**

1. Enable 2-Step Verification on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password for "Mail"
4. Use this password (not your regular password)

**Google Gemini AI:**

1. Visit https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy the key to your .env file

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/signup              # Register with email
POST   /api/auth/verify-otp          # Verify OTP code
POST   /api/auth/login               # Login
POST   /api/auth/forgot-password     # Request password reset OTP
POST   /api/auth/reset-password      # Reset password with OTP
GET    /api/auth/me                  # Get current user
PUT    /api/auth/update-profile      # Update profile
```

### Posts

```
GET    /api/posts                    # Get all posts (with pagination)
GET    /api/posts/:id                # Get single post
POST   /api/posts                    # Create post (with media)
PUT    /api/posts/:id                # Update post
DELETE /api/posts/:id                # Delete post
POST   /api/posts/:id/like           # Like post
POST   /api/posts/:id/comment        # Comment on post
GET    /api/posts/category/:category # Get posts by category
GET    /api/posts/search             # Search posts
```

### Confessions

```
POST   /api/confessions              # Submit confession (AI moderation)
GET    /api/confessions/pending      # Get pending confessions (admin)
PUT    /api/confessions/:id/approve  # Approve confession (admin)
PUT    /api/confessions/:id/reject   # Reject confession (admin)
```

### Leaderboard

```
GET    /api/leaderboard              # Get top users
```

## 🔒 Security Features

### Authentication Security

- **Bcrypt Password Hashing**: Passwords hashed with 10 salt rounds
- **JWT Tokens**: 30-day expiration with secure signing
- **OTP Verification**: 10-minute expiry, one-time use
- **Email Validation**: College email domain restriction
- **Rate Limiting**: Prevents brute force attacks

### Data Protection

- **MongoDB Sanitization**: Prevents NoSQL injection
- **CORS Configuration**: Restricted origins in production
- **Helmet.js**: Security headers (recommended)
- **Input Validation**: Server-side validation for all inputs

### Privacy

- **Anonymous Posting**: No personal info in posts
- **Alias System**: Random generated names
- **No IP Tracking**: Users remain anonymous
- **Secure File Upload**: Cloudinary handles media securely

## 🎨 Key Features Deep Dive

### OTP Authentication System

The OTP system ensures only verified college students can join:

1. User enters college email
2. 6-digit OTP generated and sent via Nodemailer
3. OTP stored in database with 10-minute expiry
4. User verifies OTP within time limit
5. Account activated, JWT token issued

**Email Template:** Professional HTML emails with OTP code

### Cloudinary Integration

Media uploads are seamlessly handled:

1. User selects image/video
2. Multer processes upload
3. File sent to Cloudinary
4. Cloudinary returns optimized URL
5. URL stored in MongoDB
6. CDN delivers media globally

**Benefits:** Fast loading, automatic optimization, unlimited storage

### AI Moderation Workflow

Every confession goes through:

1. Text submitted to Gemini AI API
2. AI analyzes sentiment, intent, and content
3. Returns classification: GREEN/YELLOW/RED
4. Backend processes based on classification
5. User receives instant feedback

**Response Time:** <2 seconds average

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique, college domain only),
  password: String (hashed),
  otp: String,
  otpExpiry: Date,
  isVerified: Boolean,
  alias: String (auto-generated),
  posts: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model

```javascript
{
  title: String,
  content: String,
  category: Enum [General, Hostel, Exams, Gossip, Placements, Confessions],
  author: ObjectId (User),
  authorAlias: String,
  media: {
    url: String (Cloudinary URL),
    type: Enum [image, video]
  },
  likes: [ObjectId],
  dislikes: [ObjectId],
  comments: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  isConfession: Boolean,
  moderationStatus: Enum [pending, approved, rejected],
  aiClassification: Enum [green, yellow, red],
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues:

**OTP emails not sending:**

- Verify Gmail app password is correct
- Check 2-step verification is enabled
- Ensure EMAIL_USER and EMAIL_PASS are set

**Cloudinary uploads failing:**

- Verify API credentials
- Check file size limits
- Ensure Cloudinary account is active

**AI moderation not working:**

- Verify GEMINI_API_KEY is valid
- Check API quota limits
- Ensure network connectivity

**MongoDB connection errors:**

- Check MongoDB is running
- Verify MONGODB_URI format
- Check network/firewall settings

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Abhinav Rajput** - [LinkedIn](https://www.linkedin.com/in/abh1navvv)

## 🙏 Acknowledgments

- Google Gemini AI for content moderation
- Cloudinary for media management
- The open-source community
- All contributors and users

## 📧 Contact

For questions or support, reach out:

- Email: abh1nav.rj02@gmail.com
- GitHub Issues: [Create an issue](https://github.com/abhinavxdd/ZeroVerse/issues)

---

<div align="center">
Made with ❤️ for college students

**Star ⭐ this repo if you find it useful!**

</div>
