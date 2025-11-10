# ConnectSphere

## Project Overview

ConnectSphere is a full-stack web application that manages users and their relationships, visualizing them as an interactive network graph. Users can create profiles with hobbies, establish friendships, and watch the network evolve with dynamic popularity scoring and hobby-based connections.

**Live Demo:** - https://connect-sphere-ten.vercel.app/

## 🎯 Key Features

### Frontend (React + TypeScript)
- **Interactive Graph Visualization** – Uses React Flow to display users as nodes and friendships as edges
- **Dynamic Node Styling** – Node colors and sizes reflect popularity scores with smooth animations
- **Hobby Sidebar** – Draggable hobbies with search/filter functionality
- **User Management** – Create, edit, and delete users with validation and confirmation dialogs
- **Real-time Updates** – Changes instantly reflect across the graph and UI
- **State Management** – React Context or Redux Toolkit for consistent data flow
- **Error Handling** – Toast notifications, loading spinners, and error boundaries
- **Responsive Design** – Works seamlessly across devices

### Backend (Node.js + Express + TypeScript)
- **RESTful API** – Complete CRUD operations for users and relationships
- **Friendship Management** – Bidirectional connections with circular friendship prevention
- **Popularity Algorithm** – Smart scoring based on friends and shared hobbies
- **Data Validation** – Comprehensive input validation with proper HTTP status codes
- **Error Handling** – Structured error responses (400, 404, 409, 500)
- **Environment Configuration** – Secure setup via .env files
- **Development Mode** – Hot-reload support with nodemon/ts-node-dev
- **Testing** – Unit tests for critical business logic

### Database
- Flexible schema supporting PostgreSQL, MongoDB, or SQLite
- User model with UUID, username, age, hobbies array, friends list, and computed popularity score

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React 18, TypeScript, React Flow, TailwindCSS, React Context/Redux |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL / MongoDB / SQLite |
| **Testing** | Jest, Supertest |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend) |
| **Tools** | Git, npm/yarn, ESLint, Prettier |

## 📋 API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Fetch all users with their data |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/:id` | Update user details |
| DELETE | `/api/users/:id` | Delete a user (must unlink first) |

### Relationships
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/:id/link` | Create a friendship connection |
| DELETE | `/api/users/:id/unlink` | Remove a friendship connection |

### Graph Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/graph` | Get complete graph data (users + relationships) |

## 📦 User Object Model

```json
{
  "id": "uuid-string",
  "username": "string (required)",
  "age": "number (required)",
  "hobbies": ["hobby1", "hobby2"],
  "friends": ["user-id-1", "user-id-2"],
  "createdAt": "2024-11-10T10:30:00Z",
  "popularityScore": "number (computed)"
}
```

## 🧮 Business Logic

### Popularity Score Formula
```
popularityScore = (number of unique friends) + (total hobbies shared with friends × 0.5)
```

### Key Rules
- **Deletion Prevention** – Users cannot be deleted while connected as friends; must unlink first
- **Circular Friendship Prevention** – Bidirectional connections (A↔B) stored as single mutual link
- **Hobby Sharing** – Shared hobbies between friends contribute to popularity calculation

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL, MongoDB, or SQLite
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SanskarBabel/ConnectSphere.git
   cd ConnectSphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations (if applicable):**
   ```bash
   npm run migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000` (or configured PORT)

## 📁 Project Structure

```
ConnectSphere/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GraphVisualization.tsx
│   │   │   ├── HobbySidebar.tsx
│   │   │   ├── UserManagementPanel.tsx
│   │   │   └── CustomNodes/
│   │   ├── context/
│   │   │   └── GraphContext.tsx
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── tests/
│   │   └── server.ts
│   └── package.json
├── README.md
└── .env.example
```

## 🧪 Testing

### Run Backend Tests
```bash
npm run test
```

### Test Coverage
Tests include:
- Relationship creation and deletion
- Popularity score calculation logic
- Circular friendship prevention
- User deletion validation
- Shared hobby counting

### Sample Test Cases
```bash
npm run test -- --verbose
```

## 📝 API Documentation

### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "username": "john_doe",
  "age": 25,
  "hobbies": ["gaming", "reading", "hiking"]
}
```

### Create Friendship
```bash
POST /api/users/{userId}/link
Content-Type: application/json

{
  "friendId": "friend-user-id"
}
```

### Get Graph Data
```bash
GET /api/graph
```

## 🔐 Environment Variables

See `.env.example` for complete configuration. Key variables:
- `NODE_ENV` – Development or production mode
- `PORT` – Server port (default: 5000)
- `DATABASE_URL` – Database connection string
- `CORS_ORIGIN` – Frontend URL for CORS
- `API_BASE_URL` – Backend API URL for frontend

## 🎨 Frontend Features

### Custom React Flow Nodes
- **HighScoreNode** – Users with popularity score > 5 (prominent styling)
- **LowScoreNode** – Users with popularity score ≤ 5 (subtle styling)
- Smooth animations on node type transitions

### Interactive Elements
- Drag hobbies onto nodes to add them
- Drag nodes to create friendships
- Confirmation dialogs for destructive actions
- Real-time popularity score updates
- Search and filter hobbies

## 📊 Performance Optimizations

- Lazy-loaded graph data for large datasets
- Debounced hobby updates and API calls
- Memoized React components to prevent unnecessary re-renders
- Efficient state management with Context API or Redux

## 🎁 Bonus Features Implemented

- **Undo/Redo Functionality** – Revert user actions with easy state rollback
- **Development Mode** – Hot-reload with nodemon/ts-node-dev
- **Load Balancing** – Node.js cluster API support (optional)
- **Redis Integration** – State synchronization across workers (optional)
- **Comprehensive Tests** – Unit and integration tests for critical paths
- **Custom Node Types** – Dynamic node styling based on popularity
- **Error Boundary** – Graceful UI crash handling

## 🌐 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy with automatic CI/CD

**Live Demo:** - https://connect-sphere-ten.vercel.app/

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📧 Support

For issues, questions, or feedback, please open an issue on the GitHub repository.

---