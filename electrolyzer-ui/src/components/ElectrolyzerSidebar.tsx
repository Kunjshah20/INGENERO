import { Search } from "lucide-react";

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filteredIds: number[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const ElectrolyzerSidebar = ({
  searchTerm,
  setSearchTerm,
  filteredIds,
  selectedId,
  onSelect,
}: SidebarProps) => (
  <div className="w-[18rem] px-[2rem] shrink-0 flex flex-col">
    <span className="text-[1rem] mb-[1.5rem]">Available Electrolyzers ID</span>

    <div className="relative w-full mb-[2rem]">
      <div className="absolute left-[0.75rem] top-[50%] -translate-y-1/2">
        <Search size={14} />
      </div>
      <input
        type="text"
        placeholder="Search Electrolyzer ID..."
        className="w-auto pl-[2.2rem] pr-[0.5rem] py-[0.5rem] text-[0.8rem] rounded-[0.25rem]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <div className="flex flex-col gap-[0.75rem]">
      {filteredIds.length > 0 ? (
        filteredIds.map((id) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full max-w-[8rem] mb-[1rem] border-none py-[0.6rem] rounded-[0.5rem] text-[0.875rem] font-[500] ${
              selectedId === id ? "bg-[#D97706]" : "bg-[#D1D5DB]"
            }`}
          >
            {id}
          </button>
        ))
      ) : (
        <p className="text-[1rem] font-[600] italic">No IDs found.</p>
      )}
    </div>
  </div>
);
