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

const CustomSelect: React.FC<Props> = ({
  options,
  placeholder = "Search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
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

  const handleSelect = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex justify-between items-center gap-3 px-4 py-2 bg-[#1E1E1E] text-[#7A7A7E] rounded-full hover:bg-white hover:bg-opacity-20"
      >
        <span>
          {selected.length > 0 ? `${selected.length} selected` : "Filter by"}
        </span>
        <img
          src={IMAGES.down}
          className={`w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          alt="down"
        />
      </button>

      {isOpen && (
        <div
          className={`absolute w-full bg-[#1E1E1E] rounded-lg shadow-lg z-50 ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {/* Search Bar */}
          <div className="flex items-center p-2 border-b border-white/20">
            <img src={IMAGES.search} className="w-5 mr-2" alt="search" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 hover:bg-white/20 cursor-pointer"
                  onClick={() => handleSelect(option.value)}
                >
                  <div
                    className={`h-5 w-5 border flex items-center justify-center border-white/20 ${
                      selected.includes(option.value) ? "bg-white" : ""
                    }`}
                  >
                    {selected.includes(option.value) && (
                      <div className="bg-[#1E1E1E] h-3 w-3" />
                    )}
                  </div>
                  <span className="text-white">{option.label}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 p-3">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
