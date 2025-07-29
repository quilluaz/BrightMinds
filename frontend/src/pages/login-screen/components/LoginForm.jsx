import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for prototype authentication
  const mockCredentials = [
    { username: 'alex_kid', password: 'story123', role: 'child' },
    { username: 'emma_reader', password: 'quest456', role: 'child' },
    { username: 'parent_demo', password: 'parent789', role: 'parent' },
    { username: 'teacher_test', password: 'teach101', role: 'educator' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Please enter your username';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Please enter your password';
    }
    
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate API call delay
    setTimeout(() => {
      const validCredential = mockCredentials.find(
        cred => cred.username === formData.username && cred.password === formData.password
      );

      if (validCredential) {
        // Store user info in localStorage for prototype
        localStorage.setItem('storyquest_user', JSON.stringify({
          username: validCredential.username,
          role: validCredential.role,
          loginTime: new Date().toISOString()
        }));
        
        navigate('/dashboard');
      } else {
        setErrors({
          general: `Oops! Wrong username or password. Try these demo accounts:\n• alex_kid / story123\n• emma_reader / quest456\n• parent_demo / parent789`
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {/* General Error Message */}
      {errors.general && (
        <div className="bg-error/10 border border-error/20 rounded-button p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="AlertCircle" size={20} className="text-error" />
            <span className="font-caption font-medium text-error">Login Help</span>
          </div>
          <p className="font-body text-sm text-error whitespace-pre-line">
            {errors.general}
          </p>
        </div>
      )}

      {/* Username Input */}
      <div className="space-y-2">
        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          required
          disabled={isLoading}
          className="text-lg"
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
          disabled={isLoading}
          className="text-lg"
        />
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="LogIn"
        iconPosition="right"
        className="h-14 text-lg font-medium"
      >
        {isLoading ? 'Logging in...' : 'Start Adventure!'}
      </Button>

      {/* Demo Credentials Helper */}
      <div className="bg-accent/10 border border-accent/20 rounded-button p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Info" size={18} className="text-accent" />
          <span className="font-caption font-medium text-accent">Demo Accounts</span>
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-body text-muted-foreground">
            <span className="font-medium">Kids:</span> alex_kid / story123
          </p>
          <p className="font-body text-muted-foreground">
            <span className="font-medium">Parents:</span> parent_demo / parent789
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;