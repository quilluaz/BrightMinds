import React from 'react';


const AgeSelector = ({ selectedAge, onAgeSelect, error }) => {
  const ageOptions = [
    { value: 5, label: '5', color: 'bg-red-100 text-red-600 hover:bg-red-200' },
    { value: 6, label: '6', color: 'bg-orange-100 text-orange-600 hover:bg-orange-200' },
    { value: 7, label: '7', color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' },
    { value: 8, label: '8', color: 'bg-green-100 text-green-600 hover:bg-green-200' },
    { value: 9, label: '9', color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
    { value: 10, label: '10', color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' },
    { value: 11, label: '11', color: 'bg-purple-100 text-purple-600 hover:bg-purple-200' },
    { value: 12, label: '12', color: 'bg-pink-100 text-pink-600 hover:bg-pink-200' }
  ];

  return (
    <div className="space-y-3">
      <label className="block font-body font-medium text-foreground">
        How old is your child? *
      </label>
      
      <div className="grid grid-cols-4 gap-3">
        {ageOptions.map((age) => (
          <button
            key={age.value}
            type="button"
            onClick={() => onAgeSelect(age.value)}
            className={`w-full h-12 rounded-button font-caption font-medium text-lg transition-all duration-200 border-2 ${
              selectedAge === age.value
                ? 'border-primary bg-primary text-primary-foreground shadow-warm animate-scale-celebration'
                : `border-transparent ${age.color}`
            }`}
          >
            {age.label}
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-error text-sm font-body mt-2 flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default AgeSelector;