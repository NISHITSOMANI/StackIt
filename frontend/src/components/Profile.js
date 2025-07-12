import React, { useState } from 'react';
import { 
  Edit, 
  MessageSquare, 
  Award, 
  Calendar,
  MapPin,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Globe
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const user = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    avatar: 'JD',
    bio: 'Full-stack developer passionate about React, Node.js, and building scalable applications. I love helping others learn and solve problems.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joined: 'January 2023',
    reputation: 1250,
    badges: [
      { name: 'Gold Badge', type: 'gold', count: 3 },
      { name: 'Silver Badge', type: 'silver', count: 8 },
      { name: 'Bronze Badge', type: 'bronze', count: 15 },
    ],
    stats: {
      questions: 23,
      answers: 156,
      accepted: 89,
      reputation: 1250
    },
    recentActivity: [
      {
        type: 'question',
        title: 'How to implement authentication in React with JWT?',
        time: '2 hours ago',
        votes: 15
      },
      {
        type: 'answer',
        title: 'Best practices for responsive design in 2024',
        time: '1 day ago',
        votes: 8
      },
      {
        type: 'question',
        title: 'Understanding async/await in JavaScript',
        time: '3 days ago',
        votes: 22
      }
    ]
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'questions', name: 'Questions' },
    { id: 'answers', name: 'Answers' },
    { id: 'activity', name: 'Activity' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'question':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'answer':
        return <Award className="w-4 h-4 text-green-600" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-bold text-xl lg:text-2xl">{user.avatar}</span>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">{user.name}</h1>
              <button className="btn-secondary flex items-center gap-2 w-full sm:w-auto">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
            
            <p className="text-secondary-600 mb-4">@{user.username}</p>
            
            <p className="text-secondary-700 mb-4">{user.bio}</p>

            {/* User Details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-secondary-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joined}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <a href={user.website} className="text-primary-600 hover:underline">
                  {user.website}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reputation */}
          <div className="text-right">
            <div className="text-2xl font-bold text-secondary-900">{user.reputation}</div>
            <div className="text-sm text-secondary-600">reputation</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-secondary-900">{user.stats.questions}</div>
          <div className="text-sm text-secondary-600">Questions</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-secondary-900">{user.stats.answers}</div>
          <div className="text-sm text-secondary-600">Answers</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-secondary-900">{user.stats.accepted}</div>
          <div className="text-sm text-secondary-600">Accepted</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-secondary-900">{user.stats.reputation}</div>
          <div className="text-sm text-secondary-600">Reputation</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-secondary-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Badges */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Badges</h3>
              <div className="flex gap-4">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${
                      badge.type === 'gold' ? 'bg-yellow-400' :
                      badge.type === 'silver' ? 'bg-gray-400' : 'bg-orange-500'
                    }`}></div>
                    <span className="text-sm font-medium text-secondary-900">{badge.name}</span>
                    <span className="text-sm text-secondary-600">({badge.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {user.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 hover:bg-secondary-50 rounded-lg transition-colors">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
                      <p className="text-xs text-secondary-600">{activity.time}</p>
                    </div>
                    <div className="text-sm text-secondary-600">
                      {activity.votes} votes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">Questions tab content would go here</p>
          </div>
        )}

        {activeTab === 'answers' && (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">Answers tab content would go here</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">Activity tab content would go here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 