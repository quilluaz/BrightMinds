import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConsentCheckboxes = ({ 
  parentalConsent, 
  privacyPolicy, 
  onParentalConsentChange, 
  onPrivacyPolicyChange,
  errors 
}) => {
  return (
    <div className="space-y-4">
      <Checkbox
        label="I am the parent or legal guardian of this child"
        description="Required to create an account for a minor"
        checked={parentalConsent}
        onChange={(e) => onParentalConsentChange(e.target.checked)}
        error={errors.parentalConsent}
        required
        className="text-sm"
      />
      
      <Checkbox
        label="I agree to the Terms of Service and Privacy Policy"
        description="We keep your family's data safe and never share it with third parties"
        checked={privacyPolicy}
        onChange={(e) => onPrivacyPolicyChange(e.target.checked)}
        error={errors.privacyPolicy}
        required
        className="text-sm"
      />
      
      <div className="bg-accent/10 rounded-button p-4 mt-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-accent-foreground text-lg">🛡️</span>
          </div>
          <div>
            <h4 className="font-body font-medium text-foreground text-sm mb-1">
              Child Safety Promise
            </h4>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              StoryQuest Kids is designed with your child's safety in mind. We use age-appropriate content, 
              secure data practices, and provide parental controls to ensure a safe learning environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentCheckboxes;