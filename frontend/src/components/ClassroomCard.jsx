const ClassroomCard = ({
  title,
  subtitle,
  icon,
  color = "primary",
  onClick,
  badge,
  badgeColor = "blue",
}) => {
  return (
    <div className={`classroom-card classroom-card-${color}`} onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        {badge && <span className={`badge badge-${badgeColor}`}>{badge}</span>}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {subtitle}
      </p>
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300">
          {icon}
        </div>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </div>
  );
};

export default ClassroomCard;
