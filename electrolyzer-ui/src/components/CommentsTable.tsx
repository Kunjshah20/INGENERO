export const CommentsTable = ({
  selectedElements,
}: {
  selectedElements: string[];
}) => (
  <div className="mt-[2rem] bg-[#D1D5DB] rounded-[0.5rem] border">
    <div className="grid grid-cols-[8rem_1fr] gap-[1rem] px-[1.5rem] py-[0.75rem] bg-gray-50">
      <span className="text-[1rem] font-[700] text-gray-400">
        Element Part ID
      </span>
      <span className="text-[1rem] font-[700] text-gray-400">Comments</span>
    </div>

    <div className="max-h-[20rem] overflow-y-auto">
      {selectedElements.map((id) => (
        <div
          key={id}
          className="grid grid-cols-[8rem_1fr] gap-[1rem] px-[1.5rem] py-[0.75rem] items-center "
        >
          <span className="text-[1rem] font-[500] text-gray-600">{id}</span>

          <div className="">
            <input
              type="text"
              placeholder="Write your comment"
              className="w-[20rem] bg-white border border-gray-200 rounded-[0.25rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] text-gray-700 outline-none placeholder:text-[#000000]"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
