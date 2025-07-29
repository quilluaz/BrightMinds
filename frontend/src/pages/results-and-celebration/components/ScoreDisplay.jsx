import React from 'react';


const ScoreDisplay = ({ correctAnswers, totalQuestions, percentage }) => {
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-accent';
    return 'text-warning';
  };

  const getScoreBgColor = () => {
    if (percentage >= 80) return 'bg-success/10';
    if (percentage >= 60) return 'bg-accent/10';
    return 'bg-warning/10';
  };

  const getEncouragementMessage = () => {
    if (percentage >= 90) return "Outstanding work! You're a reading superstar! ⭐";
    if (percentage >= 80) return "Excellent job! You really understood the story! 🌟";
    if (percentage >= 70) return "Great work! You're getting better every day! 👏";
    if (percentage >= 60) return "Good effort! Keep practicing and you'll improve! 💪";
    return "Nice try! Every story makes you smarter! 🚀";
  };

  return (
    <div className="bg-card rounded-container p-6 shadow-warm mb-6">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor()} mb-4`}>
          <span className={`font-display text-3xl ${getScoreColor()}`}>
            {percentage}%
          </span>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success rounded-full"></div>
            <span className="font-caption text-sm text-foreground">
              {correctAnswers} Correct
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-error rounded-full"></div>
            <span className="font-caption text-sm text-foreground">
              {totalQuestions - correctAnswers} Incorrect
            </span>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="font-body text-foreground text-lg font-medium">
          {getEncouragementMessage()}
        </p>
      </div>
    </div>
  );
};

export default ScoreDisplay;