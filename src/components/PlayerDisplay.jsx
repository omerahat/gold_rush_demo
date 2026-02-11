import { Pickaxe, Coins, Target } from 'lucide-react';

const PickaxeTrack = ({ count }) => (
  <div className="flex gap-2">
    {[0, 1, 2].map((idx) => (
      <Pickaxe
        key={idx}
        className={`h-7 w-7 ${idx < count ? 'text-gold-400' : 'text-red-900'}`}
        strokeWidth={idx < count ? 2 : 1}
      />
    ))}
  </div>
);

const PlayerDisplay = ({
  player,
  label,
  demandValue,
  setDemandValue,
  onDemand,
  minDemand,
  error,
  disabled,
}) => (
  <div className="rounded-3xl border border-amber-700/60 bg-gradient-to-b from-saloon-800 via-saloon-900 to-saloon-900/90 p-8 shadow-saloon">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-saloon-700/80 p-4">
          <Target className="h-8 w-8 text-amber-100" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Current Player</p>
          <p className="text-3xl font-semibold text-amber-50">{label}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Gold</p>
        <p className="text-5xl font-bold text-gold-400">{player.gold}</p>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Pickaxes</p>
        <PickaxeTrack count={player.pickaxes} />
      </div>
      <div className="text-right">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Minimum Demand</p>
        <p className="text-2xl font-semibold text-amber-200">{minDemand}</p>
      </div>
    </div>

    <div className="mt-8 space-y-3">
      <label className="flex items-center gap-3 text-amber-200">
        <Coins className="h-6 w-6 text-gold-400" />
        Enter your demand (multiple of 10)
      </label>
      <div className="flex flex-wrap gap-3">
        <input
          type="number"
          value={demandValue}
          onChange={(event) => setDemandValue(event.target.value)}
          className="flex-1 min-w-[180px] rounded-2xl border border-amber-700/80 bg-saloon-900/70 px-4 py-3 text-2xl text-amber-100 focus:border-gold-400 focus:outline-none"
          placeholder={`>= ${minDemand}`}
          step={10}
          min={minDemand}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onDemand}
          disabled={disabled}
          className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-2xl font-semibold uppercase tracking-[0.3em] transition ${
            disabled
              ? 'cursor-not-allowed bg-saloon-700/70 text-amber-600'
              : 'bg-danger-600/80 text-amber-100 hover:bg-danger-600'
          }`}
        >
          Demand
        </button>
      </div>
      {error && <p className="text-sm text-danger-500">{error}</p>}
    </div>
  </div>
);

export default PlayerDisplay;
