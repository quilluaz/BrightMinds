import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, searchResults, isSearching }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearch(searchQuery.trim());
        setShowResults(true);
      } else {
        onSearch('');
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, onSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    onSearch('');
  };

  const handleResultClick = (story) => {
    setSearchQuery(story.title);
    setShowResults(false);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search stories by title or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Icon 
            name={isSearching ? "Loader2" : "Search"} 
            size={18} 
            className={`text-muted-foreground ${isSearching ? 'animate-spin' : ''}`} 
          />
        </div>

        {/* Clear Button */}
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border border-border rounded-container shadow-warm-lg max-h-64 overflow-y-auto animate-slide-in">
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="font-caption text-sm font-medium text-foreground">
                Search Results
              </span>
              <span className="font-caption text-xs text-muted-foreground">
                {searchResults.length} found
              </span>
            </div>
            
            <div className="space-y-1 mt-2">
              {searchResults.map((story) => (
                <div
                  key={story.id}
                  onClick={() => handleResultClick(story)}
                  className="flex items-center space-x-3 p-3 rounded-button hover:bg-muted cursor-pointer transition-colors duration-200"
                >
                  <div className="w-12 h-12 rounded-button overflow-hidden flex-shrink-0">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-medium text-foreground truncate">
                      {story.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-caption text-xs text-muted-foreground">
                        {story.subject}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-caption text-xs text-muted-foreground">
                        {story.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {story.isLocked ? (
                      <Icon name="Lock" size={16} className="text-muted-foreground" />
                    ) : (
                      <Icon name="Play" size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && searchResults.length === 0 && searchQuery.trim() && !isSearching && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border border-border rounded-container shadow-warm-lg p-4 animate-slide-in">
          <div className="text-center">
            <Icon name="SearchX" size={32} className="text-muted-foreground mx-auto mb-2" />
            <h4 className="font-body text-sm font-medium text-foreground mb-1">
              No stories found
            </h4>
            <p className="font-caption text-xs text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;