import { useState, useEffect } from "react";
import { toast } from "sonner";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(profile));
    toast.success("Cập nhật thông tin thành công!");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Thông tin cá nhân
        </h2>

        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          {/* Email */}
          {/*<div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="text"
              value={profile.email}
              disabled={!isEditing}
              className="w-full border px-4 py-2 rounded-lg bg-gray-100"
            />
          </div>*/}

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Thành phố
            </label>
            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Lưu
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg"
              >
                Hủy
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}