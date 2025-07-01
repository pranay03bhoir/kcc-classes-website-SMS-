"use client";

const InfoCards = ({
  icon: Icon,
  title,
  description,
  className = "",
  iconBgColor = "from-pink-400 via-purple-400 to-blue-400",
}) => {
  return (
    <div
      className={`relative rounded-2xl p-6 shadow-xl border border-gray-200 bg-white/60 backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${className}`}
      style={{ minHeight: 180 }}
    >
      <div
        className={`flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-gradient-to-tr ${iconBgColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
      >
        <Icon className="text-white text-3xl drop-shadow-lg" />
      </div>
      <h1 className="text-lg font-semibold mb-1 text-gray-700 tracking-tight">
        {title}
      </h1>
      <p className="text-4xl font-extrabold text-gray-900 mb-1 leading-tight drop-shadow-sm">
        {description}
      </p>
    </div>
  );
};

export default InfoCards;
