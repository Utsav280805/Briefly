# Quick Start Guide - Quantum Platform

## ✅ System Status

**Frontend**: ✅ Running on http://localhost:3000  
**Backend**: ✅ Running on http://localhost:8000

## 🚀 Access the Application

### Main Pages
- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Bot Manager**: http://localhost:3000/bot-manager ⭐ **NEW**
- **Meetings**: http://localhost:3000/meetings/1
- **Tasks**: http://localhost:3000/tasks
- **Calendar**: http://localhost:3000/calendar
- **Analytics**: http://localhost:3000/analytics/emotion

### Backend API
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🎯 How to Use the Bot Manager

### Step 1: Get Your Vexa API Key
1. Go to https://vexa.ai/dashboard/api-keys
2. Sign up or log in
3. Copy your API key

### Step 2: Configure Backend
1. Open `quantum-backend/.env`
2. Add your API key:
   ```
   VEXA_API_KEY=your_actual_api_key_here
   ```
3. The backend will automatically reload

### Step 3: Start a Meeting Bot
1. Navigate to http://localhost:3000/bot-manager
2. Create a Google Meet or Microsoft Teams meeting
3. Copy the meeting URL
4. In Bot Manager:
   - Select platform (Google Meet or Teams)
   - Paste the meeting URL
   - Select language (English, Hindi, Gujarati, etc.)
   - Click "Start Bot"
5. Wait ~10 seconds for the bot to request entry
6. Admit the bot to your meeting

### Step 4: Get Transcripts
The bot will transcribe your meeting in real-time. You can:
- View active bots in the Bot Manager
- Get transcripts via API: `GET /api/meetings/{platform}/{meeting_id}/transcript`

### Step 5: End the Call ⚠️ IMPORTANT
**Always click "End Call & Free Credits"** when your meeting is finished!
- This stops the bot
- Frees up your Vexa API credits
- Prevents unnecessary charges

## 🔑 Demo Credentials

For testing authentication:
- **Email**: demo@quantum.ai
- **Password**: demo123

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Create account

### Bot Management
- `POST /api/bots/start` - Start a bot
- `POST /api/bots/stop` - Stop a bot ⚠️ Frees credits!
- `GET /api/bots/status` - Get active bots
- `PUT /api/bots/{platform}/{meeting_id}/language` - Change language

### Meetings
- `GET /api/meetings/` - List all meetings
- `GET /api/meetings/{platform}/{meeting_id}/transcript` - Get transcript
- `PATCH /api/meetings/{platform}/{meeting_id}` - Update meeting
- `DELETE /api/meetings/{platform}/{meeting_id}` - Delete transcripts

## 🎨 Features

### Frontend
✅ Modern SaaS landing page  
✅ Authentication (Login/Signup)  
✅ Dashboard with KPIs and charts  
✅ Meeting intelligence with AI summaries  
✅ Kanban task board with drag-and-drop  
✅ Smart calendar with AI follow-ups  
✅ Emotion analytics dashboard  
✅ **Bot Manager with End Call button** ⭐  
✅ Dark/Light mode  
✅ Fully responsive  

### Backend
✅ FastAPI with auto-generated docs  
✅ Complete Vexa AI integration  
✅ JWT authentication  
✅ Bot management (start/stop/status)  
✅ Real-time transcript retrieval  
✅ Meeting metadata management  
✅ Multi-language support  
✅ CORS configured for frontend  

## 🔧 Troubleshooting

### Backend won't start
- Check that port 8000 is not in use
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check `.env` file exists with required variables

### "Failed to start bot"
- Verify your Vexa API key is correct in `.env`
- Check that you have API credits available
- Ensure meeting URL format is correct

### Frontend can't connect to backend
- Check that backend is running on port 8000
- Verify `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
- Check browser console for CORS errors

### Bot doesn't join meeting
- Wait ~10 seconds after clicking "Start Bot"
- Check that you admitted the bot when it requested entry
- Verify the meeting URL is correct
- For Teams, ensure the passcode is in the URL

## 📝 Next Steps

1. **Get Vexa API Key** - Sign up at vexa.ai
2. **Add API Key to .env** - Configure backend
3. **Test Bot Manager** - Start a test meeting
4. **Explore Features** - Try all the pages
5. **Customize** - Add your branding and features

## 🎉 You're Ready!

The Quantum platform is fully functional and ready for your hackathon demo. The integration between frontend, backend, and Vexa AI is complete!

**Key Features for Demo:**
- Real meeting transcription with Vexa AI
- AI-powered insights and summaries
- Task extraction and management
- Emotion analytics
- Multi-language support
- Privacy-first design

**Remember**: Always click "End Call" to free API credits! 💰
