import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { score, label: 'Weak', color: 'text-error', bgColor: 'bg-error' };
    if (score <= 3) return { score, label: 'Fair', color: 'text-warning', bgColor: 'bg-warning' };
    if (score <= 4) return { score, label: 'Good', color: 'text-accent', bgColor: 'bg-accent' };
    return { score, label: 'Strong', color: 'text-success', bgColor: 'bg-success' };
  };

  const strength = getPasswordStrength(password);
  const strengthPercentage = (strength.score / 5) * 100;

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-caption text-xs text-muted-foreground">
          Password Strength
        </span>
        <span className={`font-caption text-xs font-medium ${strength.color}`}>
          {strength.label}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${strength.bgColor}`}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center space-x-1 ${
          password.length >= 8 ? 'text-success' : 'text-muted-foreground'
        }`}>
          <Icon name={password.length >= 8 ? 'Check' : 'X'} size={12} />
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center space-x-1 ${
          /\d/.test(password) ? 'text-success' : 'text-muted-foreground'
        }`}>
          <Icon name={/\d/.test(password) ? 'Check' : 'X'} size={12} />
          <span>Numbers</span>
        </div>
        <div className={`flex items-center space-x-1 ${
          /[A-Z]/.test(password) ? 'text-success' : 'text-muted-foreground'
        }`}>
          <Icon name={/[A-Z]/.test(password) ? 'Check' : 'X'} size={12} />
          <span>Uppercase</span>
        </div>
        <div className={`flex items-center space-x-1 ${
          /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-success' : 'text-muted-foreground'
        }`}>
          <Icon name={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'Check' : 'X'} size={12} />
          <span>Special chars</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;