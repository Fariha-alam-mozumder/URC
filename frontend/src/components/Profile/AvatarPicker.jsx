import { useEffect, useState } from "react";
import axios from "axios";
import { resolveApiUrl, resolveBackendUrl } from "../../config/api";

function AvatarPicker({ userId, token, currentUrl, onUpdated }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUrl) {
      const processedUrl = resolveBackendUrl(currentUrl);

      const t = Date.now();
      const sep = processedUrl.includes("?") ? "&" : "?";
      setPreview(`${processedUrl}${sep}t=${t}`);
      console.log("Avatar preview URL set:", `${processedUrl}${sep}t=${t}`);
    } else {
      setPreview(null);
    }
  }, [currentUrl]);

  const onSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const maxSize = 3 * 1024 * 1024;
    if (f.size > maxSize) {
      console.error("Image size must be less than 3MB");
      return;
    }
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(f.type)) {
      console.error("Please select a valid image file (PNG, JPG, JPEG, GIF, or WebP)");
      return;
    }

    setFile(f);
    const objectUrl = URL.createObjectURL(f);
    setPreview(objectUrl);
    console.log("File preview set successfully");
  };

  const onSave = async () => {
    if (!file) {
      console.error("No file selected for upload");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(
        resolveApiUrl(`/user/avatar/${userId}`),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("Avatar upload successful:", response.data);
        setFile(null);

        // Clean old blob URL
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }

        // 🔥 Use fresh server URL immediately so the preview updates without waiting for parent refetch
        const fresh = response.data.image_url; // absolute URL
        if (fresh) {
          const sep = fresh.includes("?") ? "&" : "?";
          setPreview(`${fresh}${sep}t=${Date.now()}`);
        }

        // Also ask parent to refresh profile (other places that show avatar)
        onUpdated && setTimeout(onUpdated, 200);
      } else {
        throw new Error(response.data.error || "Failed to update profile picture");
      }
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile picture";
      console.error("Avatar upload error:", message, err);
      onCancel();
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);

    if (currentUrl) {
      const processedUrl = resolveBackendUrl(currentUrl);

      const t = Date.now();
      const sep = processedUrl.includes("?") ? "&" : "?";
      setPreview(`${processedUrl}${sep}t=${t}`);
    } else {
      setPreview(null);
    }
  };

  const handleImageError = (e) => {
    console.error("Preview image failed to load:", e.target.src);
    setPreview(null);
  };

  return (
    <div className="mt-4 flex items-center gap-4">
      <div className="relative">
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            onError={handleImageError}
            key={preview}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}
        {file && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full"></div>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors">
            Choose Photo
            <input
              type="file"
              className="hidden"
              accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
              onChange={onSelect}
              disabled={saving}
            />
          </label>

          {file && (
            <>
              <button
                disabled={saving}
                onClick={onSave}
                className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                disabled={saving}
                onClick={onCancel}
                className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 3MB</p>
      </div>
    </div>
  );
}

export default AvatarPicker;
