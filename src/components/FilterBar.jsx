import { STATES } from '../utils/constants';

const FilterBar = ({ filters, setFilters, cities }) => {
    return (
        <div className="glass-panel neon-border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="w-full md:w-1/3">
                <label className="block text-sm text-blue-300 mb-1 font-medium neon-text">State</label>
                <select
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg p-2 text-blue-100 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all appearance-none cursor-pointer"
                    value={filters.state}
                    onChange={(e) => setFilters({ ...filters, state: e.target.value, city: '' })}
                >
                    <option value="">All States</option>
                    {STATES.map(state => (
                        <option key={state} value={state} className="bg-gray-900">{state.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>

            <div className="w-full md:w-1/3">
                <label className="block text-sm text-blue-300 mb-1 font-medium neon-text">City</label>
                <select
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg p-2 text-blue-100 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all appearance-none cursor-pointer disabled:opacity-50"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    disabled={!cities.length}
                >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                        <option key={city} value={city} className="bg-gray-900">{city}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
