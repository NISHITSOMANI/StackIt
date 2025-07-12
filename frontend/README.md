# StackIt - Q&A Forum Platform

A modern, responsive Q&A forum platform built with React JS and Tailwind CSS. StackIt provides a complete solution for creating and managing a question-and-answer community.

## Features

### Core Functionality
- **Dashboard Overview**: Statistics, recent questions, and trending topics
- **Question Management**: Ask, view, and manage questions with rich text support
- **Answer System**: Vote, comment, and accept answers
- **User Profiles**: Detailed user profiles with activity tracking
- **Search & Filter**: Advanced search and category filtering
- **Responsive Design**: Mobile-first design that works on all devices

### UI/UX Features
- **Modern Design**: Clean, professional interface with smooth animations
- **Dark/Light Theme Support**: Built-in theme system (easily extensible)
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Technical Features
- **React Router**: Client-side routing for seamless navigation
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Lucide Icons**: Beautiful, customizable icons
- **Component Architecture**: Modular, reusable components
- **State Management**: React hooks for local state management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stackit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard view
│   ├── Header.js        # Top navigation bar
│   ├── Sidebar.js       # Left navigation sidebar
│   ├── AskQuestion.js   # Question creation form
│   ├── QuestionDetail.js # Individual question view
│   └── Profile.js       # User profile page
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main brand color
- **Secondary**: Gray (#64748B) - Text and borders
- **Success**: Green (#10B981) - Positive actions
- **Warning**: Yellow (#F59E0B) - Cautions
- **Error**: Red (#EF4444) - Errors and destructive actions

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: Responsive scale from 12px to 48px

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Primary and secondary variants with hover states
- **Inputs**: Consistent styling with focus states
- **Tags**: Pill-shaped badges for categories and topics

## 🔧 Customization

### Adding New Pages
1. Create a new component in `src/components/`
2. Add the route in `src/App.js`
3. Update the navigation in `src/components/Sidebar.js`

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Use Tailwind utility classes for component-specific styling

### Data Integration
- Replace mock data with API calls
- Implement state management (Redux, Zustand, or Context API)
- Add authentication and user management

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Rich text editor for questions/answers
- [ ] File upload support
- [ ] Advanced search with filters
- [ ] User reputation system
- [ ] Moderation tools
- [ ] API integration
- [ ] Authentication system
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**StackIt - Built with ❤️ using React and Tailwind CSS** 