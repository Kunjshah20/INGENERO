interface ModalProps {
  type: "repair" | "assemble" | null;
  elements: string[];
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  type,
  elements,
  onClose,
  onConfirm,
}: ModalProps) => {
  if (!type) return null;

  return (
    <div className="fixed inset-[0rem] flex mt-[5.8rem] items-start justify-center">
      <div className="relative bg-[#ffffff] rounded-[1rem] border-[0.01rem] w-full max-w-[40rem]">
        <div className="flex items-center justify-between px-[1.5rem] py-[1rem] border-b border-gray-50">
          <h2>Confirm Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 text-[1.5rem] border-none bg-transparent cursor-pointer p-[0.25rem]"
          >
            X
          </button>
        </div>

        <div className="p-[2.5rem] text-left bg-[#ffffff]">
          <p>
            Update Status of Element Part ID
            <span className="bg-gray-100 font-[800] px-[0.4rem] rounded">
              {elements.join(", ")}
            </span>
            to{" "}
            <span className="text-[1rem] font-[800] mt-[0.5rem]">
              “{type === "repair" ? "Ready for Repair" : "Ready for Assembly"}”
            </span>
          </p>
        </div>

        <div className="flex items-center justify-end gap-[1rem] px-[1.5rem] py-[1rem] border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-[0.875rem] cursor-pointer font-bold text-[#D97706] bg-transparent border-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-[1.5rem] cursor-pointer py-[0.625rem] bg-[#D97706] text-[#ffffff] rounded-[0.5rem] text-[0.875rem] border-none"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
