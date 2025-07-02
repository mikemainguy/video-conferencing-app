# Video Conferencing App

A modern, feature-rich video conferencing application built with React, LiveKit, and Mantine UI. This application provides real-time video, audio, screen sharing, and chat capabilities with a clean, responsive interface.

The chief advantage of this platform is that it can be self hosted in docker or
on a VM, or even on your own gear.  No need for teams/slack/whatever licenses
and paying subscriptions.  

## Reasons you might want to do this:

- Security - being self hosted means your data never leaves your infrastructure (unless you want it to)
- Flexibility - The UI and backend are simply a "starting point" you can integrate with any tools/technologies you want.
- Cost - this can be debatable...it "might" be cheaper, it really depends on what you're trying to do with it.  Certainly for smaller shops, it's likely cheaper to self host this on inexpensive VMs/hardware and just use the cloud livekit signalling servers, at a certain level of scale though you'll want to reinvestigate this decision.  If  you have sysadmins and infrastructure that is underutilized, this might be a very compelling solution.

## Reasons you might NOT want to do this:
- you think you're going to save money, but have not technical expertise... Unless your time is worth nothing, it's quite likely this will be much more expensive as you'll need the engineering expertise to make it all work together.
- you already have a solution that meets your needs and you don't need/want more security/customization/data governance capabilities.

## 📚 Documentation

- [Features Overview](./FEATURES.md) - Detailed list of current features and roadmap
- [Custom Control Bar Guide](./documentation/customcontrolbar.md) - How to customize the control bar
- [Client Documentation](./client/README.md) - React client setup and development
- [Server Documentation](./server/README.md) - Express server setup and API endpoints

## 🚀 Features

- **Real-time Video & Audio** - High-quality video conferencing with LiveKit
- **Screen Sharing** - Share your screen with participants
- **Chat System** - Real-time messaging with message history
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Customizable UI** - Modular control bar with individual device controls
- **Drag & Drop** - Rearrange participant video tiles and chat card
- **Device Management** - Easy camera, microphone, and speaker controls
- **Room Management** - Create and join rooms with custom names
- **Security** - Optional SSL/TLS encryption support

> 📋 **For a complete list of features and roadmap, see [FEATURES.md](./FEATURES.md)**

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Mantine UI
- **Video/Audio**: LiveKit (WebRTC)
- **Backend**: Node.js, Express
- **Styling**: CSS3 with responsive design
- **Drag & Drop**: @dnd-kit
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with WebRTC support
- LiveKit server (can be self-hosted or cloud)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd video
```

### 2. Install Dependencies
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Environment Setup
```bash
# Copy environment example
cp server/env.example server/.env

# Edit server/.env with your LiveKit credentials
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
PORT=3001
NODE_ENV=development
```

### 4. Generate SSL Certificates (Optional if you want encryption with a self signed certificate)
```bash
./generate-ssl.sh
```

### 5. Start the Application
```bash
# Development mode (Express server with embedded Vite)
npm run dev

# Alternative: Run client and server separately
npm run dev:separate

# Production mode
npm run build
npm run start --workspace=server
```

### 6. Access the Application
- **HTTP**: http://localhost:3001
- **HTTPS**: https://localhost:3001 (if SSL certificates are generated)

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
PORT=3001
NODE_ENV=development
```

#### Client (.env)
```env
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_TOKEN_ENDPOINT=http://localhost:3001/api/token
VITE_API_BASE_URL=http://localhost:3001
```

### LiveKit Server Setup
1. Deploy a LiveKit server (self-hosted or cloud)
2. Get your API key and secret from LiveKit Cloud or your server
3. Update the environment variables with your LiveKit server details

## 📱 Mobile Optimization

The application includes comprehensive mobile optimizations:

- **Responsive Video Grid** - Adapts to screen size
- **Touch-Friendly Controls** - Larger touch targets
- **Mobile-Specific Layouts** - Different layouts for portrait/landscape
- **Optimized Performance** - Reduced animations and effects on mobile
- **Viewport-Based Sizing** - Uses viewport units for consistent sizing

## 🎯 Usage

### Joining a Room
1. Enter your name
2. Enter a room name (or use the default)
3. Click "Join" to enter the video conference

### Video Controls
- **Camera Button** - Toggle your camera on/off
- **Microphone Button** - Mute/unmute your microphone
- **Screen Share Button** - Start/stop screen sharing
- **Leave Room Button** - Exit the conference

### Chat Features
- **Send Messages** - Type in the chat input and press Enter
- **View History** - Chat history is automatically loaded
- **Message Notifications** - See notification pills on participant tiles

### Video Grid
- **Drag & Drop** - Reorder video tiles by dragging
- **Responsive Layout** - Automatically adjusts to screen size
- **Participant Indicators** - Visual feedback for participant states

## 🔒 Security Features

- **HTTPS Support** - Secure connections with SSL
- **Token-Based Authentication** - Secure room access
- **Environment Variable Protection** - Sensitive data in environment files
- **CORS Configuration** - Proper cross-origin resource sharing

## 🐛 Troubleshooting

### Common Issues

1. **Camera/Microphone Not Working**
   - Ensure browser permissions are granted
   - Check if devices are connected and working
   - Try refreshing the page

2. **Connection Issues**
   - Verify LiveKit server is running
   - Check environment variables are correct
   - Ensure network connectivity

3. **Mobile Issues**
   - Use HTTPS for mobile devices
   - Ensure WebRTC is supported in the browser
   - Check device permissions

### Debug Mode
Debug functionality is available in the code but hidden from the UI. To enable:
1. Uncomment the debug button in `VideoRoom.tsx`
2. Uncomment the debug panel in the same file

## 📄 API Endpoints

### Server Endpoints
- `POST /api/token` - Generate LiveKit access token
- `GET /api/health` - Health check endpoint
- `GET /api/messages/:roomName` - Get chat history
- `POST /api/messages/:roomName` - Store chat message
- `DELETE /api/messages/:roomName` - Clear chat history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [LiveKit](https://livekit.io/) - Real-time communication platform
- [Mantine](https://mantine.dev/) - React UI library
- [React](https://reactjs.org/) - UI framework
- [WebRTC](https://webrtc.org/) - Real-time communication technology
