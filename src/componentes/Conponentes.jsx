





export const InputField = ({ id, label, icon: Icon, type, placeholder, value, onChange }) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-[#8C5C32] mb-1.5">
            {label}
        </label>
        <div className="relative group">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#A60321] transition-colors duration-300" />
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-[#FAF5EC] border-2 border-[#F2E9D8] rounded-xl py-3 px-11 text-gray-800 outline-none focus:border-[#A60321] focus:ring-4 focus:ring-[#A60321]/20 transition-all duration-300 text-sm shadow-sm"
            />
        </div>
    </div>
);