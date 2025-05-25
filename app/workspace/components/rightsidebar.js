export default function Rightsidebar() {
  return (
    <>
      <div className="flex items-center gap-20 mb-5">

        {/* Inspector title */}
        <div className="font-bold text-md">Inspector</div>

        {/* Share button before title */}
        <button
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow hover:from-green-600 hover:to-blue-600 transition text-sm font-semibold"
          title="Share"
        >
          {/* Share icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12v-2a8 8 0 0116 0v2m-8 4v4m0-4a4 4 0 004-4H8a4 4 0 004 4z"
            />
          </svg>
          Share
        </button>

      </div>

      {/* Add properties/settings here */}
      <div className="text-gray-600 text-sm">No properties selected</div>
    </>
  );
}
