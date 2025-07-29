import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationWrapper from '../../components/ui/AuthenticationWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import AgeSelector from './components/AgeSelector';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator';
import ConsentCheckboxes from './components/ConsentCheckboxes';
import SuccessAnimation from './components/SuccessAnimation';
import WelcomeIllustration from './components/WelcomeIllustration';

const RegistrationScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    parentEmail: '',
    childName: '',
    childAge: null,
    password: '',
    confirmPassword: '',
    parentalConsent: false,
    privacyPolicy: false
  });
  
  const [errors, setErrors] = useState({});
  const [fieldValidation, setFieldValidation] = useState({});

  const totalSteps = 4;

  // Mock existing emails for validation
  const existingEmails = [
    'parent@example.com',
    'family@test.com',
    'guardian@demo.com'
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newValidation = { ...fieldValidation };
    
    switch (name) {
      case 'parentEmail':
        if (!value) {
          newErrors.parentEmail = 'Parent email is required';
          newValidation.parentEmail = false;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.parentEmail = 'Please enter a valid email address';
          newValidation.parentEmail = false;
        } else if (existingEmails.includes(value.toLowerCase())) {
          newErrors.parentEmail = 'This email is already registered. Try signing in instead!';
          newValidation.parentEmail = false;
        } else {
          delete newErrors.parentEmail;
          newValidation.parentEmail = true;
        }
        break;
        
      case 'childName':
        if (!value) {
          newErrors.childName = "Please enter your child's name";
          newValidation.childName = false;
        } else if (value.length < 2) {
          newErrors.childName = 'Name should be at least 2 characters';
          newValidation.childName = false;
        } else {
          delete newErrors.childName;
          newValidation.childName = true;
        }
        break;
        
      case 'childAge':
        if (!value) {
          newErrors.childAge = 'Please select your child\'s age';
          newValidation.childAge = false;
        } else {
          delete newErrors.childAge;
          newValidation.childAge = true;
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
          newValidation.password = false;
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
          newValidation.password = false;
        } else {
          delete newErrors.password;
          newValidation.password = true;
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
          newValidation.confirmPassword = false;
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
          newValidation.confirmPassword = false;
        } else {
          delete newErrors.confirmPassword;
          newValidation.confirmPassword = true;
        }
        break;
        
      case 'parentalConsent':
        if (!value) {
          newErrors.parentalConsent = 'Parental consent is required';
          newValidation.parentalConsent = false;
        } else {
          delete newErrors.parentalConsent;
          newValidation.parentalConsent = true;
        }
        break;
        
      case 'privacyPolicy':
        if (!value) {
          newErrors.privacyPolicy = 'Please accept the privacy policy';
          newValidation.privacyPolicy = false;
        } else {
          delete newErrors.privacyPolicy;
          newValidation.privacyPolicy = true;
        }
        break;
    }
    
    setErrors(newErrors);
    setFieldValidation(newValidation);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return fieldValidation.parentEmail && fieldValidation.childName;
      case 2:
        return fieldValidation.childAge;
      case 3:
        return fieldValidation.password && fieldValidation.confirmPassword;
      case 4:
        return fieldValidation.parentalConsent && fieldValidation.privacyPolicy;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" size={24} className="text-white" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                Let's Get Started!
              </h3>
              <p className="font-body text-muted-foreground text-sm">
                We need some basic information to create your family account
              </p>
            </div>

            <Input
              label="Parent/Guardian Email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.parentEmail}
              onChange={(e) => handleInputChange('parentEmail', e.target.value)}
              error={errors.parentEmail}
              required
              className="mb-4"
            />

            <Input
              label="Child's Name"
              type="text"
              placeholder="Enter your child's first name"
              value={formData.childName}
              onChange={(e) => handleInputChange('childName', e.target.value)}
              error={errors.childName}
              required
            />

            {fieldValidation.parentEmail && fieldValidation.childName && (
              <div className="bg-success/10 rounded-button p-4 flex items-center space-x-3 animate-slide-in">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <p className="font-body text-sm text-success">
                  Great! Let's continue with {formData.childName}'s profile
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Cake" size={24} className="text-white" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                How Old is {formData.childName}?
              </h3>
              <p className="font-body text-muted-foreground text-sm">
                This helps us provide age-appropriate stories and activities
              </p>
            </div>

            <AgeSelector
              selectedAge={formData.childAge}
              onAgeSelect={(age) => handleInputChange('childAge', age)}
              error={errors.childAge}
            />

            {fieldValidation.childAge && (
              <div className="bg-accent/10 rounded-button p-4 flex items-center space-x-3 animate-slide-in">
                <Icon name="Sparkles" size={20} className="text-accent" />
                <p className="font-body text-sm text-accent-foreground">
                  Perfect! We have amazing stories for {formData.childAge}-year-olds
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Lock" size={24} className="text-white" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                Secure Your Account
              </h3>
              <p className="font-body text-muted-foreground text-sm">
                Create a strong password to keep your family's account safe
              </p>
            </div>

            <Input
              label="Create Password"
              type="password"
              placeholder="Enter a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              required
              className="mb-4"
            />

            <PasswordStrengthIndicator password={formData.password} />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required
              className="mt-4"
            />

            {fieldValidation.password && fieldValidation.confirmPassword && (
              <div className="bg-success/10 rounded-button p-4 flex items-center space-x-3 animate-slide-in">
                <Icon name="Shield" size={20} className="text-success" />
                <p className="font-body text-sm text-success">
                  Excellent! Your account will be well protected
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileCheck" size={24} className="text-white" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                Almost Done!
              </h3>
              <p className="font-body text-muted-foreground text-sm">
                Just a few important agreements to complete your registration
              </p>
            </div>

            <ConsentCheckboxes
              parentalConsent={formData.parentalConsent}
              privacyPolicy={formData.privacyPolicy}
              onParentalConsentChange={(checked) => handleInputChange('parentalConsent', checked)}
              onPrivacyPolicyChange={(checked) => handleInputChange('privacyPolicy', checked)}
              errors={errors}
            />

            {fieldValidation.parentalConsent && fieldValidation.privacyPolicy && (
              <div className="bg-primary/10 rounded-button p-4 flex items-center space-x-3 animate-slide-in">
                <Icon name="Heart" size={20} className="text-primary" />
                <p className="font-body text-sm text-primary">
                  Thank you! {formData.childName}'s learning adventure is about to begin!
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthenticationWrapper showBackButton backPath="/login-screen">
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted">
        <div className="flex min-h-screen">
          {/* Welcome Illustration - Desktop Only */}
          <WelcomeIllustration />

          {/* Registration Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
              
              <div className="bg-card rounded-container shadow-warm-lg p-6 border border-border/50">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    Previous
                  </Button>

                  <Button
                    variant="default"
                    onClick={handleNextStep}
                    disabled={!canProceedToNextStep()}
                    loading={isLoading}
                    iconName={currentStep === totalSteps ? "UserPlus" : "ChevronRight"}
                    iconPosition="right"
                  >
                    {currentStep === totalSteps ? 'Create Account' : 'Next Step'}
                  </Button>
                </div>
              </div>

              {/* Encouraging Message */}
              <div className="text-center mt-6">
                <p className="font-body text-xs text-muted-foreground">
                  🌟 Join thousands of families already learning with StoryQuest Kids
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Animation */}
        <SuccessAnimation 
          isVisible={showSuccess} 
          childName={formData.childName}
        />
      </div>
    </AuthenticationWrapper>
  );
};

export default RegistrationScreen;