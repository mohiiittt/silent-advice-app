# 🎙️ Anonymous Voice Chat App

> Connect anonymously with people around the world. Get advice or share wisdom through real-time voice conversations.

## ✨ Features (Part 1 Complete)

- 🎨 **Stunning UI Design** - Modern, gradient-based interface with smooth animations
- 🎭 **Role Selection** - Choose to be an Advisor (speaker) or Listener (seeker)
- 🔒 **Anonymous** - No personal information shared during connections
- 🎵 **Real-time Audio** - MediaSoup integration for high-quality voice chat
- 🌍 **Global** - Connect with people from around the world
- 📱 **Cross-Platform** - Works on iOS, Android, and Web

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Run on your device:**
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing UI)
npm run web
```

## 📱 Navigation

To test the connection screen, navigate to:
```
/connect
```

## 🎯 How It Works

### User Flow:
1. **Select Role**: Choose between Advisor or Listener
2. **Connect**: Tap the connect button to find a match
3. **Chat**: Talk anonymously with your matched partner
4. **End**: Disconnect anytime, no history saved

### Roles:
- **👨‍🏫 Advisor**: Share your wisdom and help someone
- **👂 Listener**: Get anonymous advice and support

## 🏗️ Project Structure

```
meet-app/
├── app/
│   ├── connect/
│   │   └── index.tsx          # Connection screen (Part 1)
│   ├── (tabs)/                # Tab navigation
│   └── _layout.tsx            # Root layout
├── services/
│   └── mediasoupService.ts    # MediaSoup WebRTC service
├── types/
│   └── index.ts               # TypeScript definitions
├── components/                # Reusable components
├── constants/                 # App constants
├── assets/                    # Images and fonts
└── package.json
```

## 🎨 Design System

### Colors
- **Background**: Dark gradients (#1a1a2e → #0f3460)
- **Advisor**: Pink gradient (#e94560 → #ff6b9d)
- **Listener**: Teal gradient (#4ecca3 → #45b7d1)

### Typography
- **Title**: Bold, 32px
- **Heading**: Semibold, 24px
- **Body**: Regular, 16px

## 🔧 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tools
- **TypeScript** - Type safety
- **Expo Router** - File-based routing

### Real-time Communication
- **MediaSoup Client** - WebRTC media handling
- **Socket.IO Client** - Real-time bidirectional communication
- **React Native WebRTC** - WebRTC for mobile

### UI/UX
- **Expo Linear Gradient** - Beautiful gradients
- **Expo Vector Icons** - Icon library
- **React Native Reanimated** - Smooth animations

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [Design Showcase](./DESIGN_SHOWCASE.md) - Visual design overview
- [API Documentation](./services/mediasoupService.ts) - MediaSoup service docs

## 🎬 What's Completed (Part 1)

✅ Connection Screen with stunning design
✅ Role selection (Advisor/Listener)
✅ Smooth animations and transitions
✅ MediaSoup service structure
✅ TypeScript types and interfaces
✅ Connection state management
✅ Error handling framework

## 🚧 Coming in Part 2

⏳ Voice Call Screen
⏳ Live audio connection
⏳ Waveform visualization
⏳ Mute/unmute controls
⏳ Call timer
⏳ Backend server setup
⏳ Authentication system
⏳ Language preferences

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

### Clear Cache
```bash
npm start -- --clear
```

## 📦 Key Dependencies

```json
{
  "mediasoup-client": "^3.7.16",
  "socket.io-client": "^4.7.5",
  "react-native-webrtc": "^124.0.4",
  "expo-av": "~15.0.2",
  "expo-linear-gradient": "~14.0.2"
}
```

## 🔐 Privacy & Security

- ✅ No personal data stored
- ✅ No conversation history
- ✅ Anonymous matching
- ✅ Secure WebRTC connection
- ✅ No user tracking

## 🤝 Contributing

This is a personal project. Feel free to fork and customize!

## 📄 License

MIT License - Feel free to use this project as a template

## 🎉 Acknowledgments

- **MediaSoup** - Amazing WebRTC framework
- **Expo** - Incredible development platform
- **React Native** - Cross-platform excellence

---

## 🚀 Getting Started with Part 1

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Navigate to Connection Screen
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR code with Expo Go app

### Step 4: Test the UI
- Select "Advisor" or "Listener"
- Tap "Start Connecting"
- Watch the beautiful connection animation

### Step 5: Ready for Part 2!
Once you've tested the UI, you're ready to implement the voice call functionality in Part 2.

---

## 💡 Pro Tips

1. **Testing on Real Device**: Use Expo Go app for best experience
2. **Network Issues**: Ensure your device and computer are on the same network
3. **Permissions**: Grant microphone permissions when prompted
4. **Performance**: Test animations on physical device for smooth experience

## 🐛 Troubleshooting

### Issue: Metro bundler won't start
```bash
npm start -- --clear
```

### Issue: TypeScript errors
Restart your IDE's TypeScript server

### Issue: Dependencies not installing
```bash
npm install --legacy-peer-deps
```

### Issue: Expo Go not connecting
- Check firewall settings
- Ensure same WiFi network
- Try USB connection instead

## 📞 Support

For issues or questions:
1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review console logs for errors
3. Ensure all dependencies are installed

---

**Built with ❤️ using Expo and React Native**

**Version**: 1.0.0 (Part 1)
**Status**: ✅ Connection Screen Complete
**Next**: Voice Call Implementation
