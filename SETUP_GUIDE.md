# Anonymous Voice Chat App - Part 1 Setup Guide

## 🎯 What We've Built (Part 1)

A stunning connection screen with:
- Modern gradient-based design with smooth animations
- Role selection (Advisor/Listener)
- MediaSoup integration for real-time audio
- Connection state management
- Beautiful UI with pulsing animations

## 📦 Installation Steps

### 1. Install Dependencies

Run the following command in your project directory:

```bash
npm install
```

This will install all the new dependencies we added:
- `mediasoup-client` - For WebRTC media handling
- `socket.io-client` - For real-time communication
- `react-native-webrtc` - For WebRTC on mobile
- `expo-av` - For audio handling
- `expo-linear-gradient` - For beautiful gradients

### 2. Configure Metro Bundler

Create or update `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');

module.exports = config;
```

### 3. Update Your Server URL

Open `services/mediasoupService.ts` and update the SERVER_URL:

```typescript
const SERVER_URL = 'http://your-actual-server-url:3000';
```

## 🖥️ Server Setup (Next Steps)

You'll need to set up a MediaSoup server. Here's the structure:

### Required Server Components:

1. **Express Server** with Socket.IO
2. **MediaSoup Router** for handling WebRTC
3. **Matchmaking Logic** to pair Advisors with Listeners
4. **Language Filtering** for same-language matching

### Server Events to Implement:

- `get-rtp-capabilities` - Return router RTP capabilities
- `create-transport` - Create producer/consumer transport
- `connect-transport` - Connect transport with DTLS parameters
- `produce` - Create audio producer
- `find-match` - Find matching user
- `request-consume` - Request to consume peer's audio
- `leave-room` - Handle disconnection

## 🎨 What's in the Code

### Connection Screen (`app/connect/index.tsx`)
- Beautiful gradient background
- Animated role selection cards
- Smooth transitions and pulse effects
- Connection status updates
- Three information badges at bottom

### MediaSoup Service (`services/mediasoupService.ts`)
- Complete WebRTC handling
- Socket.IO integration
- Audio stream management
- Transport creation and management
- Error handling
- Mute/unmute functionality

### Types (`types/index.ts`)
- TypeScript interfaces for type safety
- User, Connection, and Audio settings types

## 🚀 Running the App

### For iOS:
```bash
npm run ios
```

### For Android:
```bash
npm run android
```

### For Web (Testing):
```bash
npm run web
```

## 📱 Testing the Connection Screen

1. Start the app
2. Navigate to `/connect` route
3. Select either "Advisor" or "Listener" role
4. Click "Start Connecting"
5. You'll see the connection animation (simulated for now)

## 🎯 Next Steps (Part 2)

In the next part, we'll create:

1. **Voice Call Screen**
   - Live audio connection
   - Waveform visualizations
   - Mute/unmute button
   - End call functionality
   - Timer display

2. **Backend Server**
   - Complete MediaSoup server setup
   - Matchmaking algorithm
   - Language filtering
   - Room management

3. **Authentication System**
   - Login/Signup screens
   - Anonymous user creation
   - Session management

## 🎨 Design Features

- **Color Scheme:**
  - Background: Dark gradients (#1a1a2e, #16213e, #0f3460)
  - Primary: Pink/Red gradient (#e94560, #ff6b9d)
  - Secondary: Teal/Blue (#4ecca3, #45b7d1)
  
- **Animations:**
  - Fade-in on load
  - Scale animations on button press
  - Pulsing effect during connection
  - Smooth transitions

- **Icons:**
  - Headset for app logo
  - Microphone for Advisor
  - Ear for Listener
  - Shield, Lock, Globe for features

## 🔧 Troubleshooting

### Issue: Metro bundler errors
**Solution:** Clear cache and restart
```bash
npm start -- --clear
```

### Issue: TypeScript errors
**Solution:** Restart TypeScript server in your IDE

### Issue: Gradient not showing
**Solution:** Make sure expo-linear-gradient is installed
```bash
npx expo install expo-linear-gradient
```

### Issue: Icons not showing
**Solution:** Make sure @expo/vector-icons is installed (should be by default)

## 📖 File Structure

```
meet-app/
├── app/
│   ├── connect/
│   │   └── index.tsx          # Connection screen
│   └── ...
├── services/
│   └── mediasoupService.ts    # MediaSoup logic
├── types/
│   └── index.ts               # TypeScript types
└── package.json               # Dependencies
```

## 🌟 Features Overview

### Current Features (Part 1):
✅ Beautiful connection screen
✅ Role selection (Advisor/Listener)
✅ Smooth animations
✅ MediaSoup service structure
✅ Connection state management
✅ Error handling

### Coming in Part 2:
⏳ Voice call screen with live audio
⏳ Real-time audio visualization
⏳ Backend server implementation
⏳ Actual peer-to-peer connection
⏳ Authentication system

## 💡 Tips

1. **Testing**: Use Chrome DevTools to test WebRTC on web first
2. **Permissions**: Make sure to grant microphone permissions
3. **Network**: Test on the same network initially
4. **Debugging**: Use console.log statements in mediasoupService

## 🎉 You're All Set!

Your connection screen is ready with a stunning design. Run the app and test the UI flow. In Part 2, we'll make the voice connection actually work with a complete backend!

---

**Need Help?** Check the console for error messages and make sure all dependencies are installed correctly.
