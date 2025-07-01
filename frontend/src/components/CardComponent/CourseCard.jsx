"use client";

/**
 * Reusable course card component
 * @param {Object} props
 * @param {string} props.title - Course title
 * @param {string} props.description - Brief course description
 * @param {string} props.duration - Course duration (e.g., "3 months")
 * @param {string} props.category - Course category (e.g., "Mathematics")
 * @param {string} props.classesPerWeek - Number of classes per week (e.g., "2 per week")
 * @param {string} props.gradeLevel - The grade/class level (e.g., "Class 5-8")
 * @param {number} props.rating - Star rating out of 5
 * @param {string} props.buttonText - Text for the call-to-action button
 * @param {boolean} props.isPopular - Whether to display the "Most Popular" badge
 * @param {string} props.iconUrl - URL for the course icon
 * @param {function} props.onViewDetails - Function to call when the "View Details" button is clicked
 * @param {object} props.course - The course object to pass to the onViewDetails function
 */
export default function CourseCard({
  title = "Mathematics Foundation",
  description = "Build a strong mathematical foundation with our comprehensive course covering arithmetic, algebra, geometry, and more.",
  duration = "3 months",
  category = "",
  classesPerWeek = "2 per week",
  gradeLevel = "Class 5-8",
  rating = 5,
  buttonText = "Enroll Now",
  isPopular = false,
  iconUrl = "/icons/book-icon.svg",
  onViewDetails = null,
  course = null,
}) {
  // Create an array for the star rating
  const starsArray = Array.from({ length: 5 }, (_, i) => i < rating);

  return (
    <div className="relative w-full max-w-sm bg-gradient-to-br from-blue-100 via-white to-pink-100 border border-blue-300 rounded-2xl p-6 text-gray-800 transition-transform duration-200 hover:scale-105 hover:shadow-2xl shadow-lg ring-1 ring-blue-200">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400" />
      {/* Most Popular Badge (more prominent) */}
      {isPopular && (
        <span className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-2xl z-20 scale-110 border-2 border-yellow-300">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.09 3.36a1 1 0 00.95.69h3.6c.969 0 1.371 1.24.588 1.81l-2.914 2.106a1 1 0 00-.364 1.118l1.09 3.36c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.951 2.12c-.784.57-1.838-.197-1.539-1.118l1.09-3.36a1 1 0 00-.364-1.118L3.321 8.787c-.783-.57-.38-1.81.588-1.81h3.6a1 1 0 00.95-.69l1.09-3.36z" />
          </svg>
          Popular
        </span>
      )}

      {/* Icon (with glow) */}
      <div className="flex items-center justify-center mx-auto bg-white rounded-full mb-4 w-36 h-36 shadow-lg ring-4 ring-pink-200/60">
        <img
          src={iconUrl}
          alt="Course Icon"
          className="h-28 w-28 object-contain rounded-full drop-shadow-lg"
        />
      </div>

      {/* Grade Level & Category Pills (minimal) */}
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
          {gradeLevel}
        </span>
        <span className="inline-block bg-gradient-to-r from-pink-500 to-pink-400 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
          {category}
        </span>
      </div>

      {/* Title & Rating (minimal) */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {/* Star Rating (minimal) */}
        <div className="flex space-x-0.5">
          {starsArray.map((filled, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${
                filled ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.09 3.36a1 1 0 00.95.69h3.6c.969 0 1.371 1.24.588 1.81l-2.914 2.106a1 1 0 00-.364 1.118l1.09 3.36c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.951 2.12c-.784.57-1.838-.197-1.539-1.118l1.09-3.36a1 1 0 00-.364-1.118L3.321 8.787c-.783-.57-.38-1.81.588-1.81h3.6a1 1 0 00.95-.69l1.09-3.36z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Description (minimal) */}
      <p className="text-sm text-gray-600 mb-4 leading-normal min-h-[40px]">
        {description}
      </p>

      {/* Duration & Classes (minimal) */}
      <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 text-xs text-gray-500 mb-5">
        <p>
          <span className="font-medium text-gray-700">Duration:</span>{" "}
          {duration}
        </p>
        <p>
          <span className="font-medium text-gray-700">Classes:</span>{" "}
          {classesPerWeek}
        </p>
      </div>

      {/* Enroll Button (minimal) */}
      <button
        className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-md transition-colors duration-200 text-sm"
        onClick={onViewDetails ? () => onViewDetails(course) : undefined}
      >
        {buttonText}
      </button>
    </div>
  );
}
