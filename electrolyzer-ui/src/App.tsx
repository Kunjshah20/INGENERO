import { useState } from "react";
import { electrolyzerIds, elementParts, checklistItems } from "./data/data";
import { ElectrolyzerSidebar } from "./components/ElectrolyzerSidebar";
import { ElementTable } from "./components/ElementTable";
import { Checklist } from "./components/Checklist";
import { CommentsTable } from "./components/CommentsTable";
import { ConfirmModal } from "./components/ConfirmModal";
import type { PartStatus } from "./types";

// A map of elementId & PartStatus for one electrolyzer
type ElectrolyzerState = Record<string, PartStatus>;

export default function AssetManagement() {
  // Stores the search text typed in the sidebar
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the currently selected electrolyzer ID or null if not selected
  const [selectedElectrolyzer, setSelectedElectrolyzer] = useState<
    number | null
  >(null);

  // Stores IDs of selected element parts
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  // Stores selected checklist items
  const [selectedChecklist, setSelectedChecklist] = useState<string[]>([]);

  // Store statuses for all electrolyzers
  // {
  //   electrolyzerId: {
  //     elementId: { status, count }
  //   }
  // }
  const [allStatuses, setAllStatuses] = useState<
    Record<number, ElectrolyzerState>
  >({});

  // controls the confirmation modal depending on button type
  const [showModal, setShowModal] = useState<{
    show: boolean;
    type: "repair" | "assemble" | null;
  }>({ show: false, type: null });

  // filter electrolyzer IDs based on the search term .This runs on every render when searchTerm changes
  const filteredIds = electrolyzerIds.filter((id) =>
    id.toString().includes(searchTerm)
  );

  // gets the statuses of the currently selected electrolyzer or return an empty object
  const currentStatuses = selectedElectrolyzer
    ? allStatuses[selectedElectrolyzer] || {}
    : {};

  // gets called when user selects an electrolyzer from the sidebar
  const handleElectrolyzerChange = (id: number) => {
    setSelectedElectrolyzer(id); // set electrolyzer id selected by user
    // Reset element and checklist selections because each electrolyzer has independent element parts
    setSelectedElements([]);
    setSelectedChecklist([]);
  };

  // toggle selection of an element part
  const toggleElement = (id: string) => {
    // If this element part already has a status, do nothing
    if (currentStatuses[id]) return;

    // if already element part selected -> remove (by creating a new array),
    // if not element part selected -> add (by destructuring/cloning prev and adding id into it)
    setSelectedElements((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // handle "Select All" action in ElementTable
  const handleSelectAll = (shouldSelect: boolean) => {
    if (shouldSelect) {
      // Select only elements that do NOT already have a status
      const availableIds = elementParts
        .filter((item) => !currentStatuses[item.id])
        .map((item) => item.id);
      setSelectedElements(availableIds);
    } else {
      // Clear all selection
      setSelectedElements([]);
    }
  };

  const handleConfirmAction = () => {
    // Guard clause: ensure valid state
    if (!selectedElectrolyzer || !showModal.type) return;

    // Decide the new status based on modal type
    const newStatus =
      showModal.type === "repair" ? "Ready for Repair" : "Ready for Assemble";
    const updatedStatuses = { ...currentStatuses };

    // Update status for each selected element
    selectedElements.forEach((id) => {
      updatedStatuses[id] = {
        status: newStatus,
        // For repair, store checklist count
        // For assemble, count is not needed
        count:
          showModal.type === "repair" ? selectedChecklist.length : undefined,
      };
    });

    // Save updated statuses for the selected electrolyzer
    setAllStatuses((prev) => ({
      ...prev,
      [selectedElectrolyzer]: updatedStatuses,
    }));

    // Reset transient UI state after confirmation
    setSelectedElements([]);
    setSelectedChecklist([]);
    setShowModal({ show: false, type: null });
  };

  // Toggle a checklist item selection
  const handleChecklistToggle = (item: string) => {
    setSelectedChecklist((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <header className="bg-[#D1D5DB] py-[1rem] px-[2rem] mb-[1rem] flex justify-between items-center font-[800] text-[1.5rem] w-full">
        Tephram Assent Management Solution
      </header>
      <div className="bg-[#D1D5DB] pl-[1rem] pr-[3rem] py-[0.75rem] mb-[1rem] text-xs font-[500] w-full">
        Disassembly Electrolyzer
      </div>

      <main className="flex gap-[1rem]">
        {/* Sidebar*/}
        <ElectrolyzerSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredIds={filteredIds}
          selectedId={selectedElectrolyzer}
          onSelect={handleElectrolyzerChange}
        />

        {/* rendering main content only when an electrolyzer is selected */}
        {selectedElectrolyzer && (
          <div className="flex flex-col">
            <div className="w-full px-[2rem] py-[1rem] bg-[#D1D5DB]">
              <p className="font-bold text-gray-700">
                Electrolyzer Id: {selectedElectrolyzer}
              </p>
            </div>

            <div className="flex gap-[1.5rem] items-start">
              {/* Element selection table */}
              <ElementTable
                elementParts={elementParts}
                currentStatuses={currentStatuses}
                selectedElements={selectedElements}
                onToggle={toggleElement}
                onSelectAll={handleSelectAll}
                selectedChecklistCount={selectedChecklist.length}
              />

              <div className="flex-1">
                <div className="bg-white p-[1.5rem] rounded-lg shadow-sm min-h-[500px] flex flex-col">
                  {/*Checklist*/}
                  <Checklist
                    items={checklistItems}
                    selectedItems={selectedChecklist}
                    onToggle={handleChecklistToggle}
                    onClear={() => setSelectedChecklist([])}
                  />

                  {/* comment table appear only when element part are selected */}
                  {selectedElements.length > 0 && (
                    <CommentsTable selectedElements={selectedElements} />
                  )}

                  <div className="mt-auto pt-[2.5rem] flex gap-[1rem]">
                    <button
                      disabled={
                        selectedElements.length === 0 ||
                        selectedChecklist.length === 0
                      }
                      onClick={() =>
                        setShowModal({ show: true, type: "repair" })
                      }
                      className="flex-1 bg-[#1F2937] text-[#ffffff] py-[0.75rem] rounded-md font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Send to Repair
                    </button>
                    <button
                      disabled={selectedElements.length === 0}
                      onClick={() =>
                        setShowModal({ show: true, type: "assemble" })
                      }
                      className="flex-1 bg-[#D1D5DB] text-[#000000] py-[0.75rem] rounded-md font-bold text-sm disabled:opacity-60"
                    >
                      Ready to Assemble
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showModal.show && (
        <ConfirmModal
          type={showModal.type}
          elements={selectedElements}
          onClose={() => setShowModal({ show: false, type: null })}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
}
