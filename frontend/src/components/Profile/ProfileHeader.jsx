import { useState, useEffect } from 'react';

const ProfileHeader = ({ name, role, department, avatarUrl }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageKey, setImageKey] = useState(Date.now());

  useEffect(() => {
    if (avatarUrl) {
      // Clean the URL and add cache busting
      let cleanUrl = avatarUrl;
      
      // If it's a full URL, use it as is
      if (avatarUrl.startsWith('http://localhost:8000/')) {
        cleanUrl = avatarUrl;
      } else if (avatarUrl.startsWith('/images/') || avatarUrl.startsWith('images/')) {
        // Convert relative paths to full URLs for proper CORS handling
        const imagePath = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
        cleanUrl = `http://localhost:8000${imagePath}`;
      }
      
      // Add cache busting
      const timestamp = Date.now();
      const separator = cleanUrl.includes('?') ? '&' : '?';
      setImageUrl(`${cleanUrl}${separator}t=${timestamp}`);
      setImageKey(timestamp);
    } else {
      setImageUrl("https://via.placeholder.com/80");
    }
  }, [avatarUrl]);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    // Fallback to placeholder if image fails to load
    setImageUrl("https://via.placeholder.com/80");
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageUrl);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
      <img
        key={imageKey}
        src={imageUrl || "https://via.placeholder.com/80"}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="eager"
        crossOrigin="anonymous" // Add this for CORS
      />
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-blue-500 font-medium">{role}</p>
        <p className="text-gray-500 text-sm">{department}</p>
      </div>
      <span className="ml-auto w-3 h-3 bg-green-500 rounded-full"></span>
    </div>
  );
};

export default ProfileHeader;