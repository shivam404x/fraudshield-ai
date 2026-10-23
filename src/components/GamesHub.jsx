import React, { useState } from 'react';
import { TurboRacerGame } from './TurboRacerGame';
import { CyberHackerGame } from './CyberHackerGame';
import { FallingWordsGame } from './FallingWordsGame';
import { BossBattleGame } from './BossBattleGame';
import { SpaceInvadersGame } from './SpaceInvadersGame';
import { Local1v1Duel } from './Local1v1Duel';
import { ZombieSurvivalGame } from './ZombieSurvivalGame';
import { NinjaBladeGame } from './NinjaBladeGame';
import { CyberRunnerGame } from './CyberRunnerGame';
import { CatapultSiegeGame } from './CatapultSiegeGame';
import { SubmarineSonarGame } from './SubmarineSonarGame';
import { RhythmBeatGame } from './RhythmBeatGame';
import { PotionBrewerGame } from './PotionBrewerGame';
import { DinoEscapeGame } from './DinoEscapeGame';
import { BlackHoleEscapeGame } from './BlackHoleEscapeGame';
import { 
  Gamepad2, 
  Flame, 
  Zap, 
  Terminal, 
  Trophy, 
  Swords, 
  Rocket,
  Users,
  Sparkles,
  Play,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

export const GamesHub = ({ onExit, soundProfile, volume, onAddXp }) => {
  const [selectedGame, setSelectedGame] = useState(null); // null | 'boss' | 'space' | 'racer' | 'hacker' | 'meteor' | 'duel'
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'rpg' | 'arcade' | 'versus'

  // If a game is actively running, render it in full focus
  if (selectedGame === 'boss') {
    return (
      <BossBattleGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'space') {
    return (
      <SpaceInvadersGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'racer') {
    return (
      <TurboRacerGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
      />
    );
  }

  if (selectedGame === 'hacker') {
    return (
      <CyberHackerGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
      />
    );
  }

  if (selectedGame === 'meteor') {
    return (
      <FallingWordsGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
      />
    );
  }

  if (selectedGame === 'duel') {
    return (
      <Local1v1Duel
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'zombie') {
    return (
      <ZombieSurvivalGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'ninja') {
    return (
      <NinjaBladeGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'runner') {
    return (
      <CyberRunnerGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'catapult') {
    return (
      <CatapultSiegeGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'submarine') {
    return (
      <SubmarineSonarGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'rhythm') {
    return (
      <RhythmBeatGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'potion') {
    return (
      <PotionBrewerGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'dino') {
    return (
      <DinoEscapeGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  if (selectedGame === 'blackhole') {
    return (
      <BlackHoleEscapeGame
        onExit={() => setSelectedGame(null)}
        soundProfile={soundProfile}
        volume={volume}
        onAddXp={onAddXp}
      />
    );
  }

  // Games Database
  const GAMES = [
    {
      id: 'boss',
      title: 'Titan Slayer: Dragon Raid',
      category: 'rpg',
      badge: 'RPG BOSS BATTLE',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: '🐉',
      iconBg: 'from-red-600 via-orange-500 to-amber-400',
      desc: 'Type magical spell incantations to damage Ignis the Flame Tyrant (1000 HP). Build 100% mana to cast the Ultimate Dragon Smite!',
      accentHover: 'hover:border-red-500/80 hover:shadow-red-500/20',
      buttonColor: 'bg-red-600 group-hover:bg-red-500 text-white',
      difficulty: 'Epic',
      players: '1 Player'
    },
    {
      id: 'space',
      title: 'Galaxy Defender: Space Armada',
      category: 'arcade',
      badge: 'COSMIC SHOOTER',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      icon: '🚀',
      iconBg: 'from-cyan-500 via-sky-500 to-indigo-600',
      desc: 'Alien spacecraft formations descend into Earth orbit. Type alien ship words to fire dual plasma laser cannons and defend your starfighter!',
      accentHover: 'hover:border-cyan-500/80 hover:shadow-cyan-500/20',
      buttonColor: 'bg-cyan-500 group-hover:bg-cyan-400 text-slate-950 font-black',
      difficulty: 'Medium',
      players: '1 Player'
    },
    {
      id: 'racer',
      title: 'Turbo Racer Championship',
      category: 'arcade',
      badge: 'REALTIME CAR RACE',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      icon: '🏎️',
      iconBg: 'from-orange-500 to-rose-600',
      desc: 'Race against 3 AI ghost bots on a 4-lane track in real-time. Hit a 4+ word streak with 100% accuracy to fire blazing Nitro flames!',
      accentHover: 'hover:border-orange-500/80 hover:shadow-orange-500/20',
      buttonColor: 'bg-orange-500 group-hover:bg-orange-600 text-white',
      difficulty: 'Dynamic',
      players: '1 Player'
    },
    {
      id: 'hacker',
      title: 'Matrix Breach: Cyber Defense',
      category: 'rpg',
      badge: 'TERMINAL HACKER',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: '💻',
      iconBg: 'from-emerald-500 to-cyan-500',
      desc: 'Neutralize trojans and zero-day payloads attacking the mainframe terminal before the firewall collapses. Release an EMP shockwave!',
      accentHover: 'hover:border-emerald-500/80 hover:shadow-emerald-500/20',
      buttonColor: 'bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 font-black',
      difficulty: 'Hard',
      players: '1 Player'
    },
    {
      id: 'duel',
      title: '1v1 Local Showdown Duel',
      category: 'versus',
      badge: '2-PLAYER MULTIPLAYER',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: '⚔️',
      iconBg: 'from-purple-600 to-indigo-600',
      desc: 'Play with a friend on the same keyboard! Player 1 (Blue) vs Player 2 (Red) compete to see who types the passage with the highest WPM.',
      accentHover: 'hover:border-purple-500/80 hover:shadow-purple-500/20',
      buttonColor: 'bg-purple-600 group-hover:bg-purple-500 text-white',
      difficulty: 'Versus',
      players: '2 Players'
    },
    {
      id: 'meteor',
      title: 'Meteor Type Arcade',
      category: 'arcade',
      badge: 'CLASSIC WORD DEFENSE',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      icon: '☄️',
      iconBg: 'from-indigo-600 to-sky-400',
      desc: 'Words plummet down from the digital sky! Type them quickly before they strike the ground line. Manage 3 lives and set high scores.',
      accentHover: 'hover:border-indigo-500/80 hover:shadow-indigo-500/20',
      buttonColor: 'bg-indigo-600 group-hover:bg-indigo-700 text-white',
      difficulty: 'Casual',
      players: '1 Player'
    },
    {
      id: 'zombie',
      title: 'Zombie Apocalypse: Barricade Defense',
      category: 'rpg',
      badge: 'SURVIVAL HORROR',
      badgeColor: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
      icon: '🧟',
      iconBg: 'from-lime-600 via-emerald-600 to-slate-900',
      desc: 'Hordes of shambling & sprinting zombies march on your barricade! Type words rapidly to pump shotgun rounds before they breach your perimeter.',
      accentHover: 'hover:border-lime-500/80 hover:shadow-lime-500/20',
      buttonColor: 'bg-lime-500 group-hover:bg-lime-400 text-slate-950 font-black',
      difficulty: 'Intense',
      players: '1 Player'
    },
    {
      id: 'ninja',
      title: 'Ninja Katana: Word Slicer',
      category: 'arcade',
      badge: 'FRUIT NINJA STYLE',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      icon: '🥷',
      iconBg: 'from-rose-600 via-pink-500 to-amber-500',
      desc: 'Launch words into mid-air and slice them with lightning katana precision! Build high slash combos, avoid dropped words, and trigger cherry blossom particle blasts.',
      accentHover: 'hover:border-rose-500/80 hover:shadow-rose-500/20',
      buttonColor: 'bg-rose-600 group-hover:bg-rose-500 text-white font-black',
      difficulty: 'Reflex',
      players: '1 Player'
    },
    {
      id: 'runner',
      title: 'Neon Cyber Runner: Endless Dash',
      category: 'arcade',
      badge: '3-LANE ENDLESS DASH',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
      icon: '🏃‍♂️',
      iconBg: 'from-fuchsia-600 via-purple-600 to-cyan-500',
      desc: 'Sprint through a 3-lane cyberpunk highway! Type oncoming barrier words to leap and dodge hurdles while your distance meter climbs into hyperspeed.',
      accentHover: 'hover:border-fuchsia-500/80 hover:shadow-fuchsia-500/20',
      buttonColor: 'bg-fuchsia-600 group-hover:bg-fuchsia-500 text-white font-black',
      difficulty: 'High Speed',
      players: '1 Player'
    },
    {
      id: 'catapult',
      title: 'Castle Siege: Catapult Defense',
      category: 'rpg',
      badge: 'TOWER DEFENSE',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: '🏰',
      iconBg: 'from-amber-600 via-orange-600 to-stone-900',
      desc: 'Barbarian battering rams and siege ladders march on your citadel. Type words to fire flaming catapult boulders and defend the fortress gate!',
      accentHover: 'hover:border-amber-500/80 hover:shadow-amber-500/20',
      buttonColor: 'bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black',
      difficulty: 'Hard',
      players: '1 Player'
    },
    {
      id: 'submarine',
      title: 'Abyss Submarine: Sonar Torpedo',
      category: 'arcade',
      badge: 'SONAR RADAR',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      icon: '🌊',
      iconBg: 'from-cyan-600 via-blue-600 to-slate-950',
      desc: 'Dive into the deep ocean abyss! Lock onto circular radar contacts and type acoustic words to launch cavitation homing torpedoes.',
      accentHover: 'hover:border-cyan-500/80 hover:shadow-cyan-500/20',
      buttonColor: 'bg-cyan-500 group-hover:bg-cyan-400 text-slate-950 font-black',
      difficulty: 'Reflex',
      players: '1 Player'
    },
    {
      id: 'rhythm',
      title: 'Neon Synthwave Rhythm: Beat Smasher',
      category: 'arcade',
      badge: 'GUITAR HERO STYLE',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
      icon: '⚡',
      iconBg: 'from-fuchsia-600 via-pink-600 to-indigo-600',
      desc: 'Rhythm note highway! Smash falling beat notes on D, F, J, K keys right as they cross the neon judgment line. Build 15+ combo for 2X Rainbow Fever!',
      accentHover: 'hover:border-fuchsia-500/80 hover:shadow-fuchsia-500/20',
      buttonColor: 'bg-fuchsia-600 group-hover:bg-fuchsia-500 text-white font-black',
      difficulty: 'Rhythm',
      players: '1 Player'
    },
    {
      id: 'potion',
      title: 'Spellcraft Alchemy: Potion Brewer',
      category: 'rpg',
      badge: 'POTION BREWER',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: '🧙‍♂️',
      iconBg: 'from-emerald-600 via-teal-600 to-slate-900',
      desc: 'Mystic ingredient runes descend into your bubbling cauldron. Type them quickly to drop rare herbs and brew legendary elixirs before the brew destabilizes!',
      accentHover: 'hover:border-emerald-500/80 hover:shadow-emerald-500/20',
      buttonColor: 'bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 font-black',
      difficulty: 'Magic',
      players: '1 Player'
    },
    {
      id: 'dino',
      title: 'Dino Escape: Prehistoric T-Rex Chase',
      category: 'arcade',
      badge: 'JURASSIC SPRINT',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: '🦖',
      iconBg: 'from-amber-600 via-orange-600 to-red-900',
      desc: 'An 8-ton Tyrannosaurus Rex is charging at your heels! Type obstacles to vault volcanic craters, slide under pterodactyls, and survive the jurassic valley.',
      accentHover: 'hover:border-amber-500/80 hover:shadow-amber-500/20',
      buttonColor: 'bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black',
      difficulty: 'Intense',
      players: '1 Player'
    },
    {
      id: 'blackhole',
      title: 'Black Hole Gravity: Singularity Escape',
      category: 'arcade',
      badge: 'DEEP SPACE WARP',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: '🌌',
      iconBg: 'from-purple-600 via-indigo-600 to-black',
      desc: 'Your starship is caught in the relativistic gravitational well of a cosmic singularity. Type orbital escape velocity keywords to fire ion thrusters!',
      accentHover: 'hover:border-purple-500/80 hover:shadow-purple-500/20',
      buttonColor: 'bg-purple-600 group-hover:bg-purple-500 text-white font-black',
      difficulty: 'Extreme',
      players: '1 Player'
    }
  ];

  const filteredGames = activeCategory === 'all' 
    ? GAMES 
    : GAMES.filter((g) => g.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 🌟 HERO FEATURED SPOTLIGHT BANNER: TITAN SLAYER */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-red-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40 p-6 sm:p-8 shadow-[0_0_35px_rgba(239,68,68,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Spotlight Details */}
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              🔥 Featured Game of the Week
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold">
              RPG Boss Raid
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Titan Slayer: Dragon Boss Battle 🐉
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Enter the ancient volcano chamber to face Ignis The Flame Tyrant (1000 HP). Type magical spell incantations with lightning precision to build mana and unleash the Ultimate Dragon Smite!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => setSelectedGame('boss')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-500/30 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Play Titan Slayer Now
            </button>
            <span className="text-xs text-slate-400 font-bold">
              Earn +500 XP & Dragon Slayer Trophy
            </span>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="text-7xl sm:text-8xl select-none filter drop-shadow-[0_0_20px_#ef4444] animate-pulse shrink-0">
          🐉
        </div>

      </div>

      {/* FILTER TABS & SEARCH HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Games (15)' },
            { id: 'rpg', label: '⚔️ Action & RPG (5)' },
            { id: 'arcade', label: '👾 Arcade & Reflex (9)' },
            { id: 'versus', label: '👥 2P Local Duel (1)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={onExit}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors self-end sm:self-auto"
        >
          ← Return to Lessons
        </button>
      </div>

      {/* PROPER ARRANGE: 6 GAMES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            className={`group relative bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 ${game.accentHover} rounded-3xl p-5 cursor-pointer transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between space-y-4`}
          >
            {/* Top row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${game.iconBg} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${game.badgeColor}`}>
                    {game.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {game.players}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                  {game.desc}
                </p>
              </div>
            </div>

            {/* Bottom Play Action Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">
                Difficulty: <strong className="text-slate-200">{game.difficulty}</strong>
              </span>

              <span className={`px-3.5 py-1.5 rounded-xl ${game.buttonColor} text-xs font-black flex items-center gap-1 transition-all shadow-md group-hover:translate-x-0.5`}>
                Play <Play className="w-3 h-3 fill-current" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
