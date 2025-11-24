export const SegmentedControl = ({ value, onChange, options }) => {
  return (
    <div className="flex w-full p-1 bg-gray-100 rounded-md">
      {options.map((opt, index) => {
        const isSelected = value === opt.value;

        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex-1 py-2 px-4 text-xs font-medium focus:outline-none focus:z-10
              transition-colors duration-150
              rounded-md
              ${isSelected ? 'bg-primary text-white shadow-inner' : ''}
            `}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
