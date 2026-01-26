export default function WelcomeBanner() {
  return (
    <div className="rounded-xl p-6 ">
      <h1 className="text-4xl font-extrabold text-red-800">Welcome back, Mike!</h1>
      <hr className="h-1 bg-white mt-3 mb-4 border-white shadow"/>
      <p className="mt-2 text-lg font-bold font-[Cormorant] text-gray-800 italic">
        Earn points each time you report or help return a lost item. Your impact
        helps strengthen our community of honesty, teamwork, and care.
      </p>
    </div>
  );
}