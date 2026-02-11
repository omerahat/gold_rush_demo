import { Pickaxe, User } from 'lucide-react';

const PickaxeTrack = ({ count }) => (
  <div className="flex gap-2">
    {[0, 1, 2].map((idx) => (
      <Pickaxe
        key={idx}
        className={`h-6 w-6 ${idx < count ? 'text-gold-400' : 'text-red-900'}`}
        strokeWidth={idx < count ? 1.5 : 1}
      />
    ))}
  </div>
);

const OpponentDisplay = ({ player, label }) => (
  <div className="rounded-2xl border border-amber-700/60 bg-gradient-to-b from-saloon-800 to-saloon-900/70 p-6 shadow-saloon">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-saloon-700/80 p-3">
          <User className="h-8 w-8 text-amber-200" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Opponent</p>
          <p className="text-2xl font-semibold text-amber-100">{label}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Gold</p>
        <p className="text-4xl font-bold text-gold-500">???</p>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Pickaxes</p>
      <PickaxeTrack count={player.pickaxes} />
    </div>
  </div>
);

export default OpponentDisplay;
