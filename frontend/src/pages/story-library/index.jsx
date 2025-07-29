import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StoryCard from './components/StoryCard';
import FilterChips from './components/FilterChips';
import SearchBar from './components/SearchBar';
import StoryPreviewModal from './components/StoryPreviewModal';
import SkeletonCard from './components/SkeletonCard';

const StoryLibrary = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mock story data
  const mockStories = [
    {
      id: 1,
      title: "The Magic Number Adventure",
      description: "Join Luna and Max as they discover the magical world of numbers and solve puzzles to save the Number Kingdom.",
      fullDescription: `Embark on an enchanting journey with Luna and Max as they stumble upon a hidden portal that leads to the Number Kingdom. In this magical realm, numbers come alive and each digit has its own personality and special powers.\n\nWhen the evil Chaos Monster threatens to scramble all the numbers and create mathematical mayhem, our brave heroes must use their growing math skills to restore order. Through exciting challenges involving addition, subtraction, and pattern recognition, children will help Luna and Max collect magical number crystals and unlock the secrets of arithmetic.\n\nThis interactive story combines adventure with fundamental math concepts, making learning both fun and memorable.`,
      coverImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      subject: "Math",
      difficulty: "Beginner",
      readingTime: "15 min",
      ageRange: "5-7 years",
      progress: 0,
      isLocked: false,
      potentialRewards: 150,
      badge: "Number Explorer",
      unlockRequirement: "",
      learningObjectives: [
        "Basic addition and subtraction skills",
        "Number recognition and counting",
        "Pattern identification and completion",
        "Problem-solving through mathematical thinking"
      ],
      characters: [
        { name: "Luna", role: "Curious Explorer" },
        { name: "Max", role: "Brave Problem Solver" },
        { name: "Digit", role: "Magical Number Guide" }
      ]
    },
    {
      id: 2,
      title: "Space Explorer\'s Science Quest",
      description: "Blast off with Captain Stella to explore planets, learn about gravity, and conduct exciting space experiments.",
      fullDescription: `Join Captain Stella on an incredible journey through the solar system in this interactive science adventure. As the newest member of the Galactic Research Team, young explorers will visit different planets, each presenting unique scientific challenges and discoveries.\n\nFrom understanding why objects float in space to learning about the different phases of the moon, this story makes complex scientific concepts accessible and exciting for young minds. Children will conduct virtual experiments, observe planetary phenomena, and help Captain Stella solve cosmic mysteries.\n\nThrough hands-on activities and engaging storytelling, kids will develop a love for scientific inquiry while building foundational knowledge about space, gravity, and the scientific method.`,
      coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop",
      subject: "Science",
      difficulty: "Intermediate",
      readingTime: "20 min",
      ageRange: "7-10 years",
      progress: 45,
      isLocked: false,
      potentialRewards: 200,
      badge: "Space Scientist",
      unlockRequirement: "",
      learningObjectives: [
        "Understanding basic physics concepts like gravity",
        "Learning about planets and the solar system",
        "Introduction to the scientific method",
        "Developing observation and hypothesis skills"
      ],
      characters: [
        { name: "Captain Stella", role: "Space Explorer" },
        { name: "Robo", role: "Scientific Assistant" },
        { name: "Cosmic", role: "Alien Friend" }
      ]
    },
    {
      id: 3,
      title: "The Enchanted Library Mystery",
      description: "Help Detective Ruby solve the mystery of the missing words in this reading comprehension adventure.",
      fullDescription: `When mysterious word thieves strike the Enchanted Library, it's up to Detective Ruby and her trusty magnifying glass to solve the case. In this engaging reading adventure, children become junior detectives, using their reading skills to follow clues and piece together the mystery.\n\nAs words disappear from beloved storybooks, leaving blank spaces behind, young readers must use context clues, vocabulary knowledge, and reading comprehension skills to help restore the stolen words. Each chapter presents new challenges that strengthen reading abilities while maintaining an exciting mystery narrative.\n\nThis interactive story encourages active reading, critical thinking, and vocabulary development through an engaging detective storyline that keeps children motivated to read and learn.`,
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      subject: "Reading",
      difficulty: "Intermediate",
      readingTime: "25 min",
      ageRange: "8-11 years",
      progress: 0,
      isLocked: false,
      potentialRewards: 175,
      badge: "Word Detective",
      unlockRequirement: "",
      learningObjectives: [
        "Reading comprehension and analysis",
        "Vocabulary building and context clues",
        "Critical thinking and deduction skills",
        "Story structure and narrative elements"
      ],
      characters: [
        { name: "Detective Ruby", role: "Mystery Solver" },
        { name: "Bookworm", role: "Library Guide" },
        { name: "Professor Quill", role: "Word Expert" }
      ]
    },
    {
      id: 4,
      title: "Time Travelers\' History Adventure",
      description: "Travel through time with Tim and Tina to witness historical events and meet famous figures from the past.",
      fullDescription: `Step into the Time Machine with siblings Tim and Tina for an extraordinary journey through history. This educational adventure takes young learners on visits to different time periods, from ancient civilizations to more recent historical events.\n\nChildren will witness the construction of the pyramids, attend a medieval feast, explore with famous explorers, and experience other pivotal moments in human history. Through interactive storytelling, they'll learn about different cultures, important historical figures, and how past events have shaped our modern world.\n\nThis immersive story makes history come alive, helping children understand chronology, cause and effect, and the importance of learning from the past while developing empathy for people from different time periods and cultures.`,
      coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=300&fit=crop",
      subject: "History",
      difficulty: "Advanced",
      readingTime: "30 min",
      ageRange: "9-12 years",
      progress: 0,
      isLocked: true,
      potentialRewards: 250,
      badge: "Time Explorer",
      unlockRequirement: "Complete 2 other stories first",
      learningObjectives: [
        "Understanding historical chronology and timelines",
        "Learning about different cultures and civilizations",
        "Developing empathy for historical figures",
        "Understanding cause and effect in historical events"
      ],
      characters: [
        { name: "Tim", role: "History Enthusiast" },
        { name: "Tina", role: "Cultural Explorer" },
        { name: "Chronos", role: "Time Guardian" }
      ]
    },
    {
      id: 5,
      title: "The Rainbow Art Studio",
      description: "Express creativity with artist Aria as she teaches color theory, shapes, and artistic techniques through fun projects.",
      fullDescription: `Welcome to Aria's magical art studio, where creativity knows no bounds and every child is an artist waiting to be discovered. In this colorful adventure, young artists will learn fundamental art concepts through hands-on creative projects and imaginative storytelling.\n\nFrom understanding primary and secondary colors to exploring different shapes and textures, children will develop artistic skills while creating their own masterpieces. The story incorporates art history, introduces famous artists and their techniques, and encourages self-expression through various art forms.\n\nThis interactive experience nurtures creativity, builds confidence in artistic abilities, and helps children understand that art is not just about the final product, but about the joy of creation and personal expression.`,
      coverImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      subject: "Art",
      difficulty: "Beginner",
      readingTime: "18 min",
      ageRange: "5-8 years",
      progress: 100,
      isLocked: false,
      potentialRewards: 125,
      badge: "Creative Artist",
      unlockRequirement: "",
      learningObjectives: [
        "Understanding color theory and color mixing",
        "Learning about shapes, lines, and composition",
        "Exploring different art techniques and materials",
        "Building confidence in creative self-expression"
      ],
      characters: [
        { name: "Aria", role: "Art Teacher" },
        { name: "Palette", role: "Color Helper" },
        { name: "Brush", role: "Tool Guide" }
      ]
    },
    {
      id: 6,
      title: "The Ocean\'s Secret Laboratory",
      description: "Dive deep with marine biologist Dr. Wave to discover ocean creatures and learn about underwater ecosystems.",
      fullDescription: `Plunge into the depths of the ocean with Dr. Wave, a passionate marine biologist who has dedicated her life to understanding the mysteries of the sea. In this underwater adventure, children will explore different ocean zones, from the sunny surface waters to the mysterious deep sea.\n\nYoung explorers will meet fascinating sea creatures, learn about marine food chains, and discover how ocean ecosystems work together. Through interactive experiments and observations, they'll understand concepts like adaptation, biodiversity, and environmental conservation.\n\nThis educational journey combines marine biology with environmental awareness, inspiring children to become ocean protectors while building scientific knowledge about one of Earth's most important ecosystems.`,
      coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      subject: "Science",
      difficulty: "Advanced",
      readingTime: "28 min",
      ageRange: "10-12 years",
      progress: 0,
      isLocked: true,
      potentialRewards: 300,
      badge: "Ocean Explorer",
      unlockRequirement: "Complete Space Explorer\'s Science Quest",
      learningObjectives: [
        "Understanding marine ecosystems and food chains",
        "Learning about ocean zones and their characteristics",
        "Discovering marine biodiversity and adaptation",
        "Developing environmental conservation awareness"
      ],
      characters: [
        { name: "Dr. Wave", role: "Marine Biologist" },
        { name: "Splash", role: "Dolphin Guide" },
        { name: "Coral", role: "Reef Guardian" }
      ]
    }
  ];

  // Initialize stories with loading simulation
  useEffect(() => {
    const loadStories = async () => {
      setIsLoading(true);
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStories(mockStories);
      setFilteredStories(mockStories);
      setIsLoading(false);
    };

    loadStories();
  }, []);

  // Filter stories based on active filters
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredStories(stories);
      return;
    }

    const filtered = stories.filter(story => {
      const subjectMatch = activeFilters.includes(story.subject.toLowerCase());
      const difficultyMatch = activeFilters.includes(story.difficulty.toLowerCase());
      
      const statusFilters = activeFilters.filter(filter => 
        ['available', 'in-progress', 'completed'].includes(filter)
      );
      
      let statusMatch = true;
      if (statusFilters.length > 0) {
        statusMatch = statusFilters.some(filter => {
          if (filter === 'available') return !story.isLocked && story.progress === 0;
          if (filter === 'in-progress') return story.progress > 0 && story.progress < 100;
          if (filter === 'completed') return story.progress === 100;
          return false;
        });
      }

      return (subjectMatch || difficultyMatch) && statusMatch;
    });

    setFilteredStories(filtered);
  }, [activeFilters, stories]);

  // Handle search functionality
  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = stories.filter(story =>
      story.title.toLowerCase().includes(query.toLowerCase()) ||
      story.description.toLowerCase().includes(query.toLowerCase()) ||
      story.subject.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };

  // Handle story preview
  const handleStoryPreview = (story) => {
    setSelectedStory(story);
    setShowPreviewModal(true);
  };

  // Handle starting a story
  const handleStartStory = (story) => {
    if (!story.isLocked) {
      // In a real app, this would navigate to the story gameplay
      navigate('/dashboard');
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setActiveFilters([]);
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile */}
      <div className="sticky top-16 z-40 bg-background border-b border-border shadow-warm-sm md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Icon name="BookOpen" size={24} className="text-primary" />
            <h1 className="font-display text-xl text-foreground">Story Library</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="Filter" size={20} />
          </Button>
        </div>
      </div>

      {/* Header - Desktop */}
      <div className="hidden md:block sticky top-32 z-40 bg-background border-b border-border shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="BookOpen" size={28} className="text-primary" />
              <div>
                <h1 className="font-display text-2xl text-foreground">Story Library</h1>
                <p className="font-body text-sm text-muted-foreground">
                  Discover amazing educational adventures
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Sparkles" size={20} />
              <span className="font-caption text-sm">
                {stories.filter(s => !s.isLocked).length} stories available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-48 space-y-6">
              {/* Search */}
              <div className="bg-card rounded-container border border-border p-4 shadow-warm">
                <h3 className="font-body text-lg font-semibold text-foreground mb-3">
                  Search Stories
                </h3>
                <SearchBar
                  onSearch={handleSearch}
                  searchResults={searchResults}
                  isSearching={isSearching}
                />
              </div>

              {/* Filters */}
              <div className="bg-card rounded-container border border-border p-4 shadow-warm">
                <h3 className="font-body text-lg font-semibold text-foreground mb-3">
                  Filter Stories
                </h3>
                <FilterChips
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Search */}
            <div className="md:hidden mb-4">
              <SearchBar
                onSearch={handleSearch}
                searchResults={searchResults}
                isSearching={isSearching}
              />
            </div>

            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
              <div className="mb-6 p-4 bg-accent/10 rounded-container border border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-body text-sm font-medium text-foreground">
                    Active Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <span
                      key={filter}
                      className="inline-flex items-center space-x-1 bg-accent text-accent-foreground px-3 py-1 rounded-button text-sm font-caption font-medium"
                    >
                      <span className="capitalize">{filter}</span>
                      <button
                        onClick={() => handleFilterChange(activeFilters.filter(f => f !== filter))}
                        className="hover:bg-accent-foreground/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stories Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : filteredStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onPreview={handleStoryPreview}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="BookX" size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl text-foreground mb-2">
                  No stories found
                </h3>
                <p className="font-body text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearAllFilters}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center md:hidden animate-cross-fade">
          <div className="bg-background rounded-t-container w-full max-h-[80vh] overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-background border-b border-border px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="font-body text-lg font-semibold text-foreground">
                  Filter Stories
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileFilters}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <FilterChips
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAllFilters}
              />
            </div>
            <div className="sticky bottom-0 bg-background border-t border-border p-4">
              <Button
                variant="default"
                onClick={toggleMobileFilters}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Story Preview Modal */}
      <StoryPreviewModal
        story={selectedStory}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onStartStory={handleStartStory}
      />

      {/* Bottom Spacing for Mobile Navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default StoryLibrary;