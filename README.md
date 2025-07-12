# StackIt - Q&A Platform with AI Integration

A modern Q&A platform built with React, Node.js, and Django AI services.

## Architecture

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js/Express with MongoDB
- **AI Service**: Django with ML models for content analysis
- **Database**: MongoDB

## Features

- User authentication and authorization
- Question and answer management
- AI-powered content filtering
- Tag prediction using ML models
- Answer ranking and quality assessment
- Real-time notifications
- Modern responsive UI

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StackIt
   ```

2. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env
   cp ai-review/env.example ai-review/.env
   
   # Edit the .env files with your configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:8000
   - MongoDB: localhost:27017

5. **Run tests**
   ```bash
   # Backend tests
   docker-compose exec backend npm test
   
   # Frontend tests
   docker-compose exec frontend npm test
   ```

## Manual Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB
- npm/yarn

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=mongodb://localhost:27017/stackit
# JWT_SECRET=your_secret_key
# AI_SERVICE_URL=http://localhost:8000
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with:
# REACT_APP_API_URL=http://localhost:5000
npm start
```

### AI Service Setup
```bash
cd ai-review
pip install -r requirements.txt
# Create .env file with:
# SECRET_KEY=your_django_secret
# DEBUG=True
python manage.py migrate
python manage.py runserver
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Questions
- `GET /questions` - Get all questions
- `POST /questions` - Create question
- `GET /questions/:id` - Get question by ID

### Answers
- `POST /questions/:id/answers` - Submit answer
- `POST /answers/:id/vote` - Vote on answer
- `POST /answers/:id/accept` - Accept answer

### AI Service
- `POST /api/predict-tags/` - Predict tags for question
- `POST /api/filter-content/` - Filter inappropriate content
- `POST /api/rank-answers/` - Rank answers by quality
- `GET /api/health/` - Health check

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your_super_secret_jwt_key
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:8000
```

### AI Service (.env)
```
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Development

### Adding New Features
1. Backend: Add routes in `routes/` and controllers in `controllers/`
2. Frontend: Add components in `src/components/`
3. AI Service: Add new ML models in `scanner/utils/`

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd ai-review && python manage.py test
```

## Production Deployment

1. Update environment variables for production
2. Set up proper MongoDB instance
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Use production Docker images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
