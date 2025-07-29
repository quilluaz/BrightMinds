import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProfileSettings = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const avatarOptions = [
    { value: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', label: 'Adventure Boy' },
    { value: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', label: 'Explorer Girl' },
    { value: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', label: 'Curious Kid' },
    { value: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', label: 'Smart Reader' }
  ];

  const gradeOptions = [
    { value: 'pre-k', label: 'Pre-K' },
    { value: 'kindergarten', label: 'Kindergarten' },
    { value: 'grade-1', label: 'Grade 1' },
    { value: 'grade-2', label: 'Grade 2' },
    { value: 'grade-3', label: 'Grade 3' },
    { value: 'grade-4', label: 'Grade 4' },
    { value: 'grade-5', label: 'Grade 5' }
  ];

  const interestOptions = [
    { value: 'animals', label: 'Animals' },
    { value: 'space', label: 'Space' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' }
  ];

  const handleSave = () => {
    onProfileUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type, enabled) => {
    setEditedProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: enabled
      }
    }));
  };

  return (
    <div className="mb-6">
      <div className="bg-card rounded-container border border-border shadow-warm-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-foreground flex items-center">
            <Icon name="User" size={24} className="text-primary mr-2" />
            Profile Settings
          </h2>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                iconName="Check"
                iconPosition="left"
              >
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-body font-medium text-foreground mb-4 flex items-center">
              <Icon name="Info" size={18} className="text-secondary mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                type="text"
                value={editedProfile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter display name"
              />
              <Select
                label="Grade Level"
                options={gradeOptions}
                value={editedProfile.grade}
                onChange={(value) => handleInputChange('grade', value)}
                disabled={!isEditing}
                placeholder="Select grade"
              />
            </div>
          </div>

          {/* Avatar Selection */}
          <div>
            <h3 className="font-body font-medium text-foreground mb-4 flex items-center">
              <Icon name="Image" size={18} className="text-accent mr-2" />
              Avatar
            </h3>
            {isEditing ? (
              <Select
                label="Choose Avatar"
                options={avatarOptions}
                value={editedProfile.avatar}
                onChange={(value) => handleInputChange('avatar', value)}
                placeholder="Select an avatar"
              />
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                  <img
                    src={editedProfile.avatar}
                    alt="Current avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-body text-sm text-muted-foreground">
                  Current avatar
                </span>
              </div>
            )}
          </div>

          {/* Interests */}
          <div>
            <h3 className="font-body font-medium text-foreground mb-4 flex items-center">
              <Icon name="Heart" size={18} className="text-success mr-2" />
              Learning Interests
            </h3>
            {isEditing ? (
              <Select
                label="Select Interests"
                description="Choose topics you enjoy learning about"
                options={interestOptions}
                value={editedProfile.interests}
                onChange={(value) => handleInputChange('interests', value)}
                multiple
                searchable
                placeholder="Select interests"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {editedProfile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-success/10 text-success px-3 py-1 rounded-button font-caption text-sm"
                  >
                    {interestOptions.find(opt => opt.value === interest)?.label || interest}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="font-body font-medium text-foreground mb-4 flex items-center">
              <Icon name="Bell" size={18} className="text-warning mr-2" />
              Notifications
            </h3>
            <div className="space-y-3">
              <Checkbox
                label="Daily learning reminders"
                description="Get reminded to practice reading daily"
                checked={editedProfile.notifications.dailyReminders}
                onChange={(e) => handleNotificationChange('dailyReminders', e.target.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Achievement celebrations"
                description="Receive notifications when earning badges"
                checked={editedProfile.notifications.achievements}
                onChange={(e) => handleNotificationChange('achievements', e.target.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="New story alerts"
                description="Get notified about new stories in your interests"
                checked={editedProfile.notifications.newStories}
                onChange={(e) => handleNotificationChange('newStories', e.target.checked)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Accessibility Options */}
          <div>
            <h3 className="font-body font-medium text-foreground mb-4 flex items-center">
              <Icon name="Accessibility" size={18} className="text-secondary mr-2" />
              Accessibility
            </h3>
            <div className="space-y-3">
              <Checkbox
                label="Large text mode"
                description="Use bigger text for easier reading"
                checked={editedProfile.accessibility.largeText}
                onChange={(e) => handleInputChange('accessibility', {
                  ...editedProfile.accessibility,
                  largeText: e.target.checked
                })}
                disabled={!isEditing}
              />
              <Checkbox
                label="High contrast mode"
                description="Use higher contrast colors"
                checked={editedProfile.accessibility.highContrast}
                onChange={(e) => handleInputChange('accessibility', {
                  ...editedProfile.accessibility,
                  highContrast: e.target.checked
                })}
                disabled={!isEditing}
              />
              <Checkbox
                label="Reduced animations"
                description="Minimize motion effects"
                checked={editedProfile.accessibility.reducedMotion}
                onChange={(e) => handleInputChange('accessibility', {
                  ...editedProfile.accessibility,
                  reducedMotion: e.target.checked
                })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;