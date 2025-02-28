import { useState, useEffect, useRef } from "react";
import IMAGES from "../../assets/images";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  placeholder?: string;
}

const SingleSelect: React.FC<Props> = ({ options, placeholder = "Select" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown state
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Adjust dropdown position based on available space
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 200 ? "top" : "bottom");
    }
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false); // Close after selection
  };

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="flex justify-between items-center gap-3 px-4 py-2 bg-[#1E1E1E] text-[#7A7A7E] rounded-full hover:bg-white hover:bg-opacity-20"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <img
          src={IMAGES.down}
          className={`w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          alt="down"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute w-full bg-[#1E1E1E] rounded-lg shadow-lg z-50 ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 hover:bg-white/20 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  <span className="text-white">{option.label}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 p-3">
                No options available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
