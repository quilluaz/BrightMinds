import React from 'react';
import Icon from '../../../components/AppIcon';

const AnswerReview = ({ questions, userAnswers }) => {
  return (
    <div className="bg-card rounded-container p-6 shadow-warm mb-6">
      <h3 className="font-display text-xl text-foreground mb-4 flex items-center">
        <Icon name="BookOpen" size={20} className="mr-2" />
        Answer Review
      </h3>
      
      <div className="space-y-4">
        {questions.map((question, index) => {
          const isCorrect = userAnswers[index] === question.correctAnswer;
          
          return (
            <div key={index} className="border border-border rounded-button p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCorrect ? 'bg-success text-white' : 'bg-error text-white'
                }`}>
                  <Icon name={isCorrect ? 'Check' : 'X'} size={16} />
                </div>
                
                <div className="flex-1">
                  <p className="font-body text-foreground font-medium mb-2">
                    {question.question}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="font-caption text-sm text-success font-medium">
                        Correct: {question.options[question.correctAnswer]}
                      </span>
                    </div>
                    
                    {!isCorrect && (
                      <div className="flex items-center space-x-2">
                        <Icon name="XCircle" size={16} className="text-error" />
                        <span className="font-caption text-sm text-error">
                          Your answer: {question.options[userAnswers[index]]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerReview;