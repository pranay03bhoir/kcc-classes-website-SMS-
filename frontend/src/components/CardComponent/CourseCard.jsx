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
}) {
  // Create an array for the star rating
  const starsArray = Array.from({ length: 5 }, (_, i) => i < rating);

  return (
    <div className="relative w-full max-w-sm bg-white rounded-xl shadow-lg p-5 text-gray-700">
      {/* Most Popular Badge */}
      {isPopular && (
        <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          Most Popular
        </span>
      )}

      {/* Icon */}
      <div className="flex items-center justify-center mx-auto bg-blue-50 rounded-full mb-4 ">
        <img
          src={iconUrl}
          alt="Course Icon"
          className="h-52 w-screen rounded-4xl object-cover bg-black"
        />
      </div>

      {/* Grade Level Pill */}
      <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
        {gradeLevel}
      </span>
      <span className="ms-2 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
        {category}
      </span>

      {/* Title & Rating */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {/* Star Rating */}
        <div className="flex space-x-1">
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

      {/* Description */}
      <p className="text-md text-gray-600 mb-3">{description}</p>

      {/* Duration & Classes */}
      <div className="text-md text-gray-500 mb-4 flex gap-12">
        <p>
          <strong>Duration:</strong> {duration}
        </p>
        <p>
          <strong>Classes:</strong> {classesPerWeek}
        </p>
      </div>

      {/* Enroll Button */}
      <button className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition">
        {buttonText}
      </button>
    </div>
  );
}
