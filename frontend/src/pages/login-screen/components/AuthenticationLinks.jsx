import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuthenticationLinks = () => {
  return (
    <div className="space-y-6 pt-6">
      {/* Sign Up Link */}
      <div className="text-center">
        <p className="font-body text-muted-foreground mb-4">
          New to StoryQuest Kids?
        </p>
        <Button
          variant="outline"
          fullWidth
          asChild
          iconName="UserPlus"
          iconPosition="left"
          className="h-12 text-base"
        >
          <Link to="/registration-screen">
            Create New Account
          </Link>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 font-caption text-muted-foreground">
            Need Help?
          </span>
        </div>
      </div>

      {/* Help Options */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-12 flex-col space-y-1"
          iconName="HelpCircle"
        >
          <span className="text-xs">Forgot</span>
          <span className="text-xs">Password?</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-12 flex-col space-y-1"
          iconName="Users"
        >
          <span className="text-xs">Parent</span>
          <span className="text-xs">Access</span>
        </Button>
      </div>

      {/* Safety Notice */}
      <div className="bg-success/10 border border-success/20 rounded-button p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Shield" size={18} className="text-success" />
          <span className="font-caption font-medium text-success">Safe & Secure</span>
        </div>
        <p className="font-body text-xs text-success">
          Your privacy and safety are our top priority. All activities are monitored and child-friendly.
        </p>
      </div>
    </div>
  );
};

export default AuthenticationLinks;