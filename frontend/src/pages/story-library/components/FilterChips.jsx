import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ activeFilters, onFilterChange, onClearAll }) => {
  const filterOptions = [
    { id: 'all', label: 'All Stories', icon: 'Grid3X3' },
    { id: 'math', label: 'Math', icon: 'Calculator' },
    { id: 'science', label: 'Science', icon: 'Microscope' },
    { id: 'reading', label: 'Reading', icon: 'BookOpen' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'art', label: 'Art', icon: 'Palette' }
  ];

  const difficultyOptions = [
    { id: 'beginner', label: 'Beginner', icon: 'CircleDot' },
    { id: 'intermediate', label: 'Intermediate', icon: 'Circle' },
    { id: 'advanced', label: 'Advanced', icon: 'Target' }
  ];

  const statusOptions = [
    { id: 'available', label: 'Available', icon: 'Unlock' },
    { id: 'in-progress', label: 'In Progress', icon: 'Play' },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const isFilterActive = (filterId) => activeFilters.includes(filterId);

  const handleFilterClick = (filterId) => {
    if (filterId === 'all') {
      onFilterChange([]);
      return;
    }
    
    const newFilters = isFilterActive(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    onFilterChange(newFilters);
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-4">
      {/* Subject Filters */}
      <div className="space-y-2">
        <h4 className="font-caption text-sm font-medium text-foreground">Subject</h4>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <Button
              key={filter.id}
              variant={isFilterActive(filter.id) || (filter.id === 'all' && !hasActiveFilters) ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(filter.id)}
              className="transition-all duration-200 animate-bounce-gentle"
              iconName={filter.icon}
              iconPosition="left"
              iconSize={14}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Difficulty Filters */}
      <div className="space-y-2">
        <h4 className="font-caption text-sm font-medium text-foreground">Difficulty</h4>
        <div className="flex flex-wrap gap-2">
          {difficultyOptions.map((filter) => (
            <Button
              key={filter.id}
              variant={isFilterActive(filter.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(filter.id)}
              className="transition-all duration-200"
              iconName={filter.icon}
              iconPosition="left"
              iconSize={14}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="space-y-2">
        <h4 className="font-caption text-sm font-medium text-foreground">Status</h4>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((filter) => (
            <Button
              key={filter.id}
              variant={isFilterActive(filter.id) ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(filter.id)}
              className="transition-all duration-200"
              iconName={filter.icon}
              iconPosition="left"
              iconSize={14}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground"
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Active Filter Count */}
      {hasActiveFilters && (
        <div className="flex items-center justify-center space-x-2 bg-accent/10 rounded-button py-2 px-3">
          <Icon name="Filter" size={16} className="text-accent" />
          <span className="font-caption text-sm font-medium text-accent">
            {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} active
          </span>
        </div>
      )}
    </div>
  );
};

export default FilterChips;