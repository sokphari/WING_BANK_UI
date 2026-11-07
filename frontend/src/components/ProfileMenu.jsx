import { Link } from "react-router-dom";

export default function ProfileMenu({ profile }) {
  return (
    <Link
      to="/profile"
      className="inline-flex h-12 items-center gap-3 rounded-full bg-gray-100 px-4 text-base font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500"
      aria-label="Open profile page"
    >
      {profile?.avatar ? (
        <img
          src={profile.avatar}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-100 text-lg font-bold text-lime-700">
          {(profile?.name || "U").charAt(0).toUpperCase()}
        </span>
      )}
      <span className="hidden md:inline">{profile?.name || "Profile"}</span>
    </Link>
  );
}
