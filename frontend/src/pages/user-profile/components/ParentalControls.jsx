import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ParentalControls = ({ settings, onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const controlSections = [
    {
      id: 'privacy',
      title: 'Privacy Settings',
      icon: 'Shield',
      controls: [
        {
          id: 'shareProgress',
          label: 'Share progress with teachers',
          description: 'Allow teachers to view learning progress',
          checked: settings.shareProgress
        },
        {
          id: 'allowFriends',
          label: 'Connect with friends',
          description: 'Enable friend connections and comparisons',
          checked: settings.allowFriends
        }
      ]
    },
    {
      id: 'content',
      title: 'Content Controls',
      icon: 'BookOpen',
      controls: [
        {
          id: 'ageAppropriate',
          label: 'Age-appropriate content only',
          description: 'Filter stories based on age settings',
          checked: settings.ageAppropriate
        },
        {
          id: 'educationalOnly',
          label: 'Educational content priority',
          description: 'Prioritize educational over entertainment content',
          checked: settings.educationalOnly
        }
      ]
    },
    {
      id: 'time',
      title: 'Time Management',
      icon: 'Clock',
      controls: [
        {
          id: 'dailyTimeLimit',
          label: 'Daily time limits',
          description: `Current limit: ${settings.dailyTimeLimit} minutes`,
          checked: settings.enableTimeLimit
        },
        {
          id: 'breakReminders',
          label: 'Break reminders',
          description: 'Remind to take breaks every 30 minutes',
          checked: settings.breakReminders
        }
      ]
    }
  ];

  const handleControlChange = (sectionId, controlId, checked) => {
    onSettingsChange({
      ...settings,
      [controlId]: checked
    });
  };

  const handlePasswordVerification = () => {
    // Mock password verification
    setShowPasswordPrompt(false);
    setIsExpanded(true);
  };

  const toggleExpanded = () => {
    if (!isExpanded) {
      setShowPasswordPrompt(true);
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-card rounded-container border border-border shadow-warm-sm overflow-hidden">
        {/* Header */}
        <div 
          onClick={toggleExpanded}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="Settings" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="font-display text-lg text-foreground">
                Parental Controls
              </h2>
              <p className="font-caption text-sm text-muted-foreground">
                Manage safety and content settings
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Icon name="Lock" size={12} className="text-white" />
            </div>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              className="text-muted-foreground" 
            />
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border p-4 space-y-6">
            {controlSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name={section.icon} size={18} className="text-primary" />
                  <h3 className="font-body font-medium text-foreground">
                    {section.title}
                  </h3>
                </div>
                
                <div className="space-y-3 ml-6">
                  {section.controls.map((control) => (
                    <div key={control.id} className="flex items-start space-x-3">
                      <Checkbox
                        checked={control.checked}
                        onChange={(e) => handleControlChange(section.id, control.id, e.target.checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="font-body text-sm text-foreground cursor-pointer">
                          {control.label}
                        </label>
                        <p className="font-caption text-xs text-muted-foreground mt-1">
                          {control.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-body font-medium text-foreground mb-3 flex items-center">
                <Icon name="Zap" size={18} className="text-secondary mr-2" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  className="justify-start"
                >
                  Export Progress Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RotateCcw"
                  iconPosition="left"
                  className="justify-start"
                >
                  Reset All Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-cross-fade">
          <div className="bg-background rounded-container p-6 max-w-sm w-full shadow-warm-lg animate-scale-celebration">
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Lock" size={24} className="text-warning" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                Parental Verification
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Enter the parental control password to access settings.
              </p>
              <div className="space-y-4">
                <div className="bg-muted rounded-button p-3 text-center">
                  <p className="font-mono text-sm text-muted-foreground">
                    Demo Password: parent123
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordPrompt(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handlePasswordVerification}
                    className="flex-1"
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentalControls;