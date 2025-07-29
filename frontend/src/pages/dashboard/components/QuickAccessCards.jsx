import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickAccessCards = () => {
  const navigate = useNavigate();

  const quickAccessItems = [
    {
      title: "Story Library",
      description: "Explore new adventures",
      icon: "Library",
      color: "primary",
      bgColor: "primary/10",
      path: "/story-library",
      stats: "12 new stories"
    },
    {
      title: "Completed Adventures",
      description: "Revisit your favorites",
      icon: "CheckCircle",
      color: "success",
      bgColor: "success/10",
      path: "/results-and-celebration",
      stats: "8 completed"
    },
    {
      title: "My Profile",
      description: "View progress & settings",
      icon: "User",
      color: "secondary",
      bgColor: "secondary/10",
      path: "/user-profile",
      stats: "Level 5"
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="mb-6">
      <h3 className="font-display text-lg text-foreground mb-4">Quick Access</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickAccessItems.map((item, index) => (
          <div
            key={index}
            className={`bg-${item.bgColor} rounded-container p-6 shadow-warm-sm cursor-pointer transition-all duration-200 hover:shadow-warm hover:scale-105`}
            onClick={() => handleCardClick(item.path)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-${item.color} rounded-full flex items-center justify-center shadow-warm`}>
                <Icon name={item.icon} size={24} className="text-white" />
              </div>
              <span className={`font-caption text-xs font-medium text-${item.color} bg-white/50 px-2 py-1 rounded-button`}>
                {item.stats}
              </span>
            </div>
            
            <h4 className="font-body font-semibold text-foreground mb-2">
              {item.title}
            </h4>
            
            <p className="font-body text-muted-foreground text-sm mb-4">
              {item.description}
            </p>
            
            <div className="flex items-center justify-end">
              <Icon name="ArrowRight" size={16} className={`text-${item.color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessCards;