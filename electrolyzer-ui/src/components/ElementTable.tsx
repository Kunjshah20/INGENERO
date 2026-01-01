import React from "react";
import type { ElementPart, PartStatus } from "../types";

interface ElementTableProps {
  elementParts: ElementPart[];
  currentStatuses: Record<string, PartStatus>;
  selectedElements: string[];
  onToggle: (id: string) => void;
  onSelectAll: (shouldSelect: boolean) => void;
  selectedChecklistCount: number;
}

export const ElementTable = ({
  elementParts,
  currentStatuses,
  selectedElements,
  onToggle,
  onSelectAll,
  selectedChecklistCount,
}: ElementTableProps) => {
  const isAllSelected =
    selectedElements.length > 0 &&
    selectedElements.length ===
      elementParts.length - Object.keys(currentStatuses).length;
  return (
    <div className="p-[1rem] bg-[#f5f6f6]">
      <div className="grid grid-cols-[150px_1fr_150px] gap-y-[1rem] text-xs items-center">
        <span className="text-[1rem] font-bold text-gray-400 tracking-wider mt-[0.5rem] flex justify-center">
          Position
        </span>
        <span className="text-[1rem] ml-[1.2rem] mt-[0.5rem] font-bold text-gray-400 tracking-wider">
          Element part ID
        </span>
        <div className="flex items-center justify-center gap-[0.25rem] text-[1rem] font-bold text-gray-400">
          <span
            className="cursor-pointer mt-[0.5rem]"
            // Pass the opposite of current state
            onClick={() => onSelectAll(!isAllSelected)}
          >
            Select all
          </span>
        </div>

        {elementParts.map((item) => {
          const status = currentStatuses[item.id];
          const isSelected = selectedElements.includes(item.id);

          return (
            <React.Fragment key={item.id}>
              <span className="text-gray-500 flex justify-center font-medium">
                {item.position}
              </span>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={!!status}
                  onChange={() => onToggle(item.id)}
                  className="rounded accent-[#D97706] mr-[0.5rem] cursor-pointer disabled:cursor-not-allowed"
                />
                <span
                  className={`py-[0.5rem] px-[1rem] rounded w-24 text-center font-bold transition-all duration-200 ${
                    isSelected
                      ? "bg-[#D97706] text-white shadow-sm"
                      : "bg-[#9CA3AF] text-white"
                  } ${status ? "opacity-40" : ""}`}
                >
                  {item.id}
                </span>
              </div>

              <div className="flex justify-start">
                {status && (
                  <span
                    className={`py-[0.75rem] px-[1rem] rounded-full text-[0.7rem] text-[#ffffff] font-bold whitespace-nowrap shadow-sm ${
                      status.status.includes("Repair")
                        ? "bg-[#DC2626]"
                        : "bg-[#10B981]"
                    }`}
                  >
                    {status.status}
                  </span>
                )}
                {isSelected && !status && selectedChecklistCount > 0 ? (
                  <span className="w-[1.25rem] h-[1.25rem] bg-[#D1D5DB] rounded-full flex items-center justify-center text-[10px] text-gray-600 shrink-0">
                    {selectedChecklistCount}
                  </span>
                ) : (
                  status?.count !== undefined &&
                  status.count > 0 && (
                    <span className="w-[1.25rem] h-[1.25rem] bg-[#D1D5DB] rounded-full flex items-center justify-center text-[10px] ml-[0.5rem] mt-[0.5rem] text-gray-600 shrink-0">
                      {status.count}
                    </span>
                  )
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
