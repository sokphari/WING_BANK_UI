import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function ProfilePage({
  profile,
  profileLoading,
  profileError,
  onReload,
  onSave,
  onDelete,
  handleLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [avatar, setAvatar] = useState(profile?.avatar || null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageOk, setMessageOk] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(profile?.name || "");
    setEmail(profile?.email || "");
    setAvatar(profile?.avatar || null);
  }, [profile]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessageOk(false);
      setMessage("Choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessageOk(false);
      setMessage("Choose an image smaller than 8 MB.");
      return;
    }

    try {
      const image = await createImageBitmap(file);
      const maxSide = 384;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();

      const resized = canvas.toDataURL("image/jpeg", 0.76);
      if (resized.length > 850000) {
        setMessageOk(false);
        setMessage("That image could not be compressed enough. Choose another image.");
        return;
      }
      setAvatar(resized);
      setMessage("");
    } catch {
      setMessageOk(false);
      setMessage("Could not read that image. Try another file.");
    } finally {
      event.target.value = "";
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await onSave({ name, email, avatar });
      setMessageOk(true);
      setMessage("Profile saved successfully.");
    } catch (error) {
      setMessageOk(false);
      setMessage(error.message || "Could not save profile.");
    } finally {
      setBusy(false);
    }
  };

  const deleteProfile = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await onDelete(password);
    } catch (error) {
      setMessageOk(false);
      setMessage(error.message || "Could not delete profile.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f8]">
      <DashboardHeader
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        profile={profile}
      />
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
        {profileLoading && !profile ? (
          <section className="rounded-2xl bg-white p-8 text-slate-600 shadow-sm sm:p-10">
            Loading your profile…
          </section>
        ) : !profile ? (
          <section className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
            <h1 className="text-2xl font-bold text-slate-900">Profile unavailable</h1>
            <p className="mt-2 text-slate-600">
              {profileError || "Could not load your current name and email."}
            </p>
            <button
              type="button"
              onClick={onReload}
              className="mt-5 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Try again
            </button>
          </section>
        ) : (
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-9">
          <div className="border-b border-slate-100 pb-6">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="mt-2 text-slate-500">Manage your personal information and profile photo.</p>
          </div>

          <form onSubmit={saveProfile} className="mt-7 space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {avatar ? (
                <img src={avatar} alt="Profile" className="h-24 w-24 rounded-full object-cover ring-4 ring-lime-50" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-lime-100 text-3xl font-bold text-lime-700 ring-4 ring-lime-50">
                  {(name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <label className="inline-flex cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Change photo
                  <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                </label>
                {avatar && (
                  <button type="button" onClick={() => setAvatar(null)} className="ml-3 text-sm font-medium text-red-600 hover:text-red-700">
                    Remove photo
                  </button>
                )}
                <p className="mt-2 text-xs text-slate-500">Images are resized before saving. Maximum original file size: 8 MB.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Full name
                <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} autoComplete="name" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Email address
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={255} autoComplete="email" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
            </div>

            {message && (
              <p role={messageOk ? "status" : "alert"} className={`text-sm ${messageOk ? "text-green-700" : "text-red-600"}`}>
                {message}
              </p>
            )}

            <button type="submit" disabled={busy} className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60">
              {busy ? "Saving…" : "Save profile"}
            </button>
          </form>

          <form onSubmit={deleteProfile} className="mt-10 border-t border-red-100 pt-7">
            <h2 className="text-lg font-bold text-red-700">Delete profile</h2>
            <p className="mt-1 text-sm text-slate-500">This permanently deletes your profile and its linked accounts.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block flex-1 text-sm font-semibold text-slate-700">
                Confirm with your password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" />
              </label>
              <button type="submit" disabled={busy} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {busy ? "Please wait…" : "Delete profile"}
              </button>
            </div>
          </form>
        </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
