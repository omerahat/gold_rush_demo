const HUD = ({ zoneName, minDemand, round }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-700/50 bg-saloon-800/80 px-6 py-4 shadow-saloon">
    <div>
      <p className="text-sm uppercase tracking-[0.2em] text-amber-500">Current Depth</p>
      <p className="text-3xl font-semibold text-gold-400">
        {zoneName} <span className="text-base text-amber-300">- Min Bet: {minDemand}</span>
      </p>
    </div>
    <div className="text-right">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-500">Round</p>
      <p className="text-4xl font-semibold text-gold-300">{round}</p>
    </div>
  </div>
);

export default HUD;
