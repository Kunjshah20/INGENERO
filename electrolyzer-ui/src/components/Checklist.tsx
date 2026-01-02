interface ChecklistProps {
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  onClear: () => void;
}

export const Checklist = ({
  items,
  selectedItems,
  onToggle,
  onClear,
}: ChecklistProps) => (
  <div className="flex flex-col">
    <label className="block text-[1rem] mt-[1.5rem] font-medium text-[#9ea0a4] mb-[0.5rem]">
      Cut Out Comments
    </label>
    <textarea
      placeholder="Cut Out Comments here"
      className="w-auto min-h-[8rem] p-[1rem] bg-[#EDEDED] border-none rounded-[0.5rem] text-[1rem] outline-none resize-none placeholder-[#9ea0a4]"
    />

    <div className="flex justify-between items-center mt-[2rem] mb-[1rem]">
      <div className="flex items-center gap-[0.6rem] whitespace-nowrap">
        <span className="text-[1rem] font-bold">Disassembly Checklist</span>
        <span className="flex items-center justify-center w-[1.5rem] h-[1.5rem] bg-[#D1D5DB] text-[0.85rem] mt-[0.1rem] font-bold rounded-full">
          {selectedItems.length}
        </span>
      </div>

      <button
        onClick={onClear}
        className="text-[1rem] mt-[0.5rem] underline bg-transparent border-none cursor-pointer"
      >
        Clear Selection
      </button>
    </div>

    <div className="flex flex-wrap gap-[0.75rem]">
      {items.map((item) => {
        const isSelected = selectedItems.includes(item);
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`px-[1rem] py-[0.375rem] cursor-pointer rounded-full text-[0.75rem] font-[500] ${
              isSelected
                ? "bg-[#ffc98b] border-[#f3d1ab]"
                : "bg-white border-none"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
);
