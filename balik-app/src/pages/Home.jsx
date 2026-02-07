import { useState } from "react"
import { Link } from "react-router-dom";
import { valuableItemsCards, systemCards } from "./data/cards"
import { categories, foundItems } from "./data/recentlyFoundData"
import headerBg from "../assets/home-assets/bg-header.png"
import { whyBalikData } from "./data/whyBalikData"
import { topContributors } from "./data/topContributorsData"
import { successStories } from "./data/successStoriesData"
import { securityData } from "./data/securityData"
import { faqData } from "./data/faqData"
import { Search, ChevronDown, Users, UserPlus, LogIn } from "lucide-react"
import { joinFeaturesData } from "./data/joinFeaturesData"

function Home() {

  const [step, setStep] = useState(1)

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const [index, setIndex] = useState(0);
  const story = successStories[index];

  const prevStory = () => {
    setIndex((prev) =>
      prev === 0 ? successStories.length - 1 : prev - 1
    )
  }

  const nextStory = () => {
    setIndex((prev) =>
      prev === successStories.length - 1 ? 0 : prev + 1
    )
  }

  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFAQs = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      {/* HEADER */}
      <div
        className="relative w-full h-[450px] flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-24 pt-24 text-white"
        style={{
          backgroundImage: `url(${headerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#F5E6E6]/20 to-[#ffdac9]/90"></div>

        {/* Left Content */}
        <div className="relative z-20 flex flex-col justify-center max-w-3xl font-['Plus_Jakarta_Sans']">
          <h2 className="leading-tight text-4xl md:text-5xl mb-4 text-[#520000] font-extrabold">
            Lost Something On Campus? <br />
            Let’s Help You Find It.
          </h2>

          <p className="text-base font-bold font-['Lora'] mb-6 text-[#331e0c]">
            Looked everywhere on campus? Don’t stress! <br />
            Report, search, or claim lost items in minutes. <br />
            BALIK helps you reconnect with what matters.
          </p>
        </div>

        {/* Right Content (Buttons) */}
        <div className="relative z-20 flex flex-col md:flex-row gap-4 items-center">
          <button className="-translate-y-8 translate-x-5 mb-5 bg-[#E30000] text-white font-bold px-10 py-4 rounded-3xl shadow-lg border border-[#a11010] hover:bg-[#230000de] hover:shadow-2xl transition-all duration-300">
            Report Lost Item
          </button>

          <button className="translate-y-8 -translate-x-10 bg-[#02D44F] text-white font-bold px-10 py-4 rounded-3xl shadow-lg border border-[#2eb857] hover:bg-[#0e361a] hover:shadow-2xl transition-all duration-300">
            Report Found Item
          </button>
        </div>
      </div>

      {/* SECTION 1*/}
      <section className="flex flex-col p-12 items-center justify-center bg-[#f7e6dc] shadow-[inset_0_1px_12px_rgba(0,0,0,0.12),_inset_0_-0.5px_12px_rgba(0,0,0,0.10)]">
        <h2 className="text-5xl font-extrabold mb-5 text-center">
          The Frustration of Losing Valuable Items
        </h2>

        <p className="mb-10 text-center max-w-2xl">
          Every day, thousands of people experience the stress and anxiety of
          losing important belongings.
        </p>

        {/* Stat Card */}
        <div className="mb-12 p-4 text-xl rounded-2xl shadow-lg border border-[#a11010] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white">
          73% of people lose valuable items monthly, spending 12+ hours
          searching
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mb-6">
          {valuableItemsCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 mb-4">
                <img
                  src={card.icon}
                  alt={`${card.title} icon`}
                  className="w-6 h-6 object-contain"
                />
              </div>

              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2*/}
      <section className="flex flex-col p-12 items-center justify-center">
        <h2 className="text-3xl text-black font-extrabold mb-10 text-center">
          How Our System Works
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl px-5 mx-auto">
          {systemCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <img
                  src={card.icon}
                  alt={`${card.title} icon`}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <h3 className="text-lg font-semibold mb-4">{card.title}</h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="w-[250px] h-px bg-gray-500 mt-2 mx-auto"></div>

      {/* SECTION 3*/}
      <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
          Recently Found Items
        </h2>
        <p className="text-gray-500 text-lg">
          Admin-verified items waiting to be reunited with their owners
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-3 mb-12">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium
              ${
                cat === "All Items"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {foundItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover"
              />

              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                ✓ Verified
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-1">
                {item.title}
              </h3>

              <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mb-2">
                {item.tag}
              </span>

              <p className="text-sm text-gray-600 mb-4">
                {item.description}
              </p>

              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>{item.location}</span>
                <span>{item.date}</span>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Forms (Report) Section 4 */}
    <div className="min-h-screen flex justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-2xl bg-transparent">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[2.8rem] text-black font-extrabold mb-2">Report a Found Item</h1>
          <p className="text-gray-500">
            Help us reunite items with their owners in just a few steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium
                    ${step === num ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}
                  `}
                >
                  {num}
                </div>
                {num !== 3 && <div className="w-10 h-1 bg-gray-200" />}
              </div>
            ))}
          </div>

          <span className="text-sm text-gray-500">
            Step {step} of 3
          </span>
        </div>

        {/* Form */}
        <form className="space-y-6">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="input-group">
                <label className="font-medium">
                  What type of item did you find <span className="text-red-500">*</span>
                </label>
                <input className="input" />
              </div>

              <div className="input-group">
                <label className="font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <select className="input">
                  <option>Select category</option>
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Bags</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="font-medium">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input className="input" />
                </div>

                <div className="input-group">
                  <label className="font-medium">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input className="input" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="input-group">
                <label className="font-medium">
                  Date Found <span className="text-red-500">*</span>
                </label>
                <input type="date" className="input" />
              </div>

              <div className="input-group">
                <label className="font-medium">
                  Location <span className="text-red-500">*</span>
                </label>
                <select className="input">
                  <option>Select location</option>
                  <option>Main Building</option>
                  <option>Library</option>
                  <option>ITECH</option>
                </select>
              </div>

              <div className="input-group">
                <label className="font-medium">
                  Time <span className="text-red-500">*</span>
                </label>
                <input type="time" className="input" />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="input-group">
                <label className="font-medium">
                  Additional Information <span className="text-red-500">*</span>
                </label>
                <textarea className="input h-28 resize-none" />
              </div>

              <div className="input-group">
                <label className="font-medium">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <input type="file" className="input" />
              </div>

              <div className="input-group">
                <label className="font-medium">
                  Where did you turn in the item? <span className="text-red-500">*</span>
                </label>
                <input className="input" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" />
                <label className="text-red-600 font-medium">
                  Report Anonymously
                </label>
              </div>

              <div className="input-group">
                <label className="font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input className="input" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input className="input" />
                </div>

                <div className="input-group">
                  <label className="font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input className="input" />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium"
              >
                Back
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium"
              >
                Continue
              </button>
            )}

            {step === 3 && (
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium"
              >
                Submit Report
              </button>
            )}
          </div>

        </form>
      </div>

      {/* Small utility styles */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            outline: none;
          }
          .input:focus {
            border-color: #22c55e;
          }
          .input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
        `}
      </style>
    </div>

    {/* SECTION 5 */}
    <section className="w-full py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
          Why Choose BALIK?
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
          The most advanced lost and found platform powered by AI and community trust
        </p>

        {/* Grid inner section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {whyBalikData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-4"
              >
                <Icon className="w-10 h-10 text-blue-600" />

                <h3 className="text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* SECTION 6 */}
    <section className="w-full py-28 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-[2.8rem] text-black font-extrabold mb-3">
          Earn Rewards for Helping Others
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
          Calculate your potential earnings and see top community contributors
        </p>

        {/* Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-2xl font-bold mb-6 text-left">
            Top Contributors
          </h3>

          <div className="flex flex-col gap-4">
            {topContributors.map((user) => (
              <div
                key={user.rank}
                className="
                  flex items-center justify-between
                  p-4 rounded-xl border border-gray-200
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-lg
                "
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    {user.initials}
                  </div>

                  {/* Info */}
                  <div className="text-left">
                    <p className="font-medium leading-tight">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.items} items reunited
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-blue-600 font-semibold">
                    {user.points.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    points
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 7 - success stories */}
    <section className="w-full py-25 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
          Success Stories
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
          Real people, real reunions, real impact
        </p>

        {/* Story */}
        <div className="relative">
          {/* Avatar placeholder */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-6" />

          {/* Name */}
          <h3 className="text-xl font-semibold">
            {story.name}
          </h3>
          <p className="text-gray-500 mb-2">
            {story.role}
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-1 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < story.rating
                    ? "text-yellow-400 text-lg"
                    : "text-gray-300 text-lg"
                }
              >
                ★
              </span>
            ))}
          </div>

          {/* Quote */}
          <p className="italic text-lg text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed">
            “{story.quote}”
          </p>

          {/* Reunited item */}
          <div className="flex justify-center items-center gap-2 text-blue-600 font-medium mb-14">
            <span className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-xs">
              ✓
            </span>
            Reunited: {story.reunitedItem}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <button 
              onClick={prevStory}
              className="
                w-20 h-20 flex items-center justify-center
                rounded-full
                text-3xl text-gray-400
                hover:text-gray-700 hover:bg-gray-100
                transition cursor-pointer"
            > ‹
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {successStories.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={prevStory}
              className="
                w-20 h-20 flex items-center justify-center
                rounded-full
                text-3xl text-gray-400
                hover:text-gray-700 hover:bg-gray-100
                transition cursor-pointer"
            > ›
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* SECTION 8 */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
          Your Security is Our Priority
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-16">
          Multiple layers of protection ensure safe and trustworthy reunions
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 text-left shadow-sm hover:shadow-lg transition"
              >
                <Icon className="w-10 h-10 text-green-500 mb-6" />

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* SECTION 9 - FAQ SECTION */}
    <section className="py-20 bg-white" id="faqs">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-[2.8rem] text-black font-extrabold mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
            Everything you need to know about BALIK
          </p>
        </div>

        {/* Search */}
        <div className="relative mt-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* FAQ List */}
        <div className="mt-12 space-y-6">
          {filteredFAQs.length === 0 && (
            <p className="text-center text-gray-500">
              No matching questions found.
            </p>
          )}

          {filteredFAQs.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-300 pb-6 cursor-pointer"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>

              {openIndex === index && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* SECTION 10 */}
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
      
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-green-600 font-medium mb-6  hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white">
          <Users className="w-5 h-5" />
          Join 1,200+ new members this week
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Join the BALIK Community Today
        </h2>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          Be part of the movement reuniting people with their belongings
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            <UserPlus className="w-5 h-5" />
            Sign Up for Free
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            <LogIn className="w-5 h-5" />
            Login
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          {joinFeaturesData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index}>
                <Icon className="w-7 h-7 mx-auto text-blue-600 mb-8" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    </main>
  )
}

export default Home
