import { useState } from "react";
import { electrolyzerIds, elementParts, checklistItems } from "./data/data";
import { ElectrolyzerSidebar } from "./components/ElectrolyzerSidebar";
import { ElementTable } from "./components/ElementTable";
import { Checklist } from "./components/Checklist";
import { CommentsTable } from "./components/CommentsTable";
import { ConfirmModal } from "./components/ConfirmModal";
import type { PartStatus } from "./types";

type ElectrolyzerState = Record<string, PartStatus>;

export default function AssetManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElectrolyzer, setSelectedElectrolyzer] = useState<
    number | null
  >(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<string[]>([]);
  const [allStatuses, setAllStatuses] = useState<
    Record<number, ElectrolyzerState>
  >({});
  const [showModal, setShowModal] = useState<{
    show: boolean;
    type: "repair" | "assemble" | null;
  }>({ show: false, type: null });

  const filteredIds = electrolyzerIds.filter((id) =>
    id.toString().includes(searchTerm)
  );
  const currentStatuses = selectedElectrolyzer
    ? allStatuses[selectedElectrolyzer] || {}
    : {};

  const handleElectrolyzerChange = (id: number) => {
    setSelectedElectrolyzer(id);
    setSelectedElements([]);
    setSelectedChecklist([]);
  };

  const toggleElement = (id: string) => {
    if (currentStatuses[id]) return;
    setSelectedElements((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.checked) {
  //     const availableIds = elementParts
  //       .filter((item) => !currentStatuses[item.id])
  //       .map((item) => item.id);
  //     setSelectedElements(availableIds);
  //   } else setSelectedElements([]);
  // };
  const handleSelectAll = (shouldSelect: boolean) => {
    if (shouldSelect) {
      const availableIds = elementParts
        .filter((item) => !currentStatuses[item.id])
        .map((item) => item.id);
      setSelectedElements(availableIds);
    } else {
      setSelectedElements([]);
    }
  };

  const handleConfirmAction = () => {
    if (!selectedElectrolyzer || !showModal.type) return;
    const newStatus =
      showModal.type === "repair" ? "Ready for Repair" : "Ready for Assemble";
    const updatedStatuses = { ...currentStatuses };
    selectedElements.forEach((id) => {
      updatedStatuses[id] = {
        status: newStatus,
        count:
          showModal.type === "repair" ? selectedChecklist.length : undefined,
      };
    });
    setAllStatuses((prev) => ({
      ...prev,
      [selectedElectrolyzer]: updatedStatuses,
    }));
    setSelectedElements([]);
    setSelectedChecklist([]);
    setShowModal({ show: false, type: null });
  };

  const handleChecklistToggle = (item: string) => {
    setSelectedChecklist((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-[#ffffff] overflow-x-hidden">
      <div className="bg-[#D1D5DB] py-[1rem] px-[3rem] mb-[1rem] flex justify-between items-center font-[800] text-[1.5rem]">
        Tephram Assent Management Solution
      </div>
      <div className="bg-[#D1D5DB] px-[1rem] py-[0.75rem] mb-[1rem] text-xs font-[500] text-gray-600">
        Disassembly Electrolyzer
      </div>

      <main className="flex gap-[1rem]">
        <ElectrolyzerSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredIds={filteredIds}
          selectedId={selectedElectrolyzer}
          onSelect={handleElectrolyzerChange}
        />

        {selectedElectrolyzer && (
          <div className="flex flex-col">
            <div className="w-full p-[1rem] bg-[#D1D5DB]">
              <p className="font-bold text-gray-700">
                Electrolyzer Id: {selectedElectrolyzer}
              </p>
            </div>

            <div className="flex gap-[1.5rem] items-start">
              <ElementTable
                elementParts={elementParts}
                currentStatuses={currentStatuses}
                selectedElements={selectedElements}
                onToggle={toggleElement}
                onSelectAll={handleSelectAll}
                selectedChecklistCount={selectedChecklist.length}
              />

              <div className="flex-1">
                <div className="bg-white p-6 rounded-lg shadow-sm min-h-[500px] flex flex-col">
                  <Checklist
                    items={checklistItems}
                    selectedItems={selectedChecklist}
                    onToggle={handleChecklistToggle}
                    onClear={() => setSelectedChecklist([])}
                  />

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
