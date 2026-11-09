import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX,
  Heart, Search, Home, Library, Plus, ListMusic, Mic2, Sparkles, SlidersHorizontal
} from 'lucide-react';

// Sample Data Catalog
const INITIAL_TRACKS = [
  {
    id: '1',
    title: 'Midnight Horizon',
    artist: 'Neon Dreams',
    album: 'Cybernetic Echoes',
    duration: 215,
    genre: 'Eletrônica',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3',
    lyrics: [
      { time: 0, text: '[Instrumental Intro]' },
      { time: 15, text: 'Riding through the neon city lights' },
      { time: 28, text: 'Shadows fade into the midnight skies' },
      { time: 42, text: 'Feel the rhythm of the cyber beat' },
      { time: 58, text: 'Electric pulses beneath our feet' },
      { time: 75, text: '[Synth Solo]' },
      { time: 105, text: 'Lost in the digital frequency' },
      { time: 120, text: 'You and me in perfect harmony' }
    ]
  },
  {
    id: '2',
    title: 'Velocity Pulse',
    artist: 'Aetheris',
    album: 'Quantum Shift',
    duration: 184,
    genre: 'Rock',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=energetic-rock-10110.mp3',
    lyrics: [
      { time: 0, text: 'Turn up the drive, ignite the spark' },
      { time: 20, text: 'We leave a trail across the dark' },
      { time: 40, text: 'Breaking barriers speed of sound' },
      { time: 65, text: 'We are the lost now finally found' }
    ]
  },
  {
    id: '3',
    title: 'Solar Flare Groove',
    artist: 'Luna Eclipse',
    album: 'Starlight Avenue',
    duration: 198,
    genre: 'Pop',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=funky-dance-10023.mp3',
    lyrics: [
      { time: 0, text: 'Sunlight fading into gold' },
      { time: 18, text: 'Stories waiting to be told' },
      { time: 35, text: 'Dance beneath the glowing sky' },
      { time: 55, text: 'Watch the cosmic wonders fly' }
    ]
  },
  {
    id: '4',
    title: 'Smooth Horizon',
    artist: 'The Velvet Trio',
    album: 'Late Night Sessions',
    duration: 240,
    genre: 'Jazz',
    cover: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc069e2b10.mp3?filename=jazz-lounge-11082.mp3',
    lyrics: [
      { time: 0, text: '[Saxophone Intro]' },
      { time: 30, text: 'Whispers in the quiet room' },
      { time: 60, text: 'Scent of coffee and perfume' }
    ]
  },
  {
    id: '5',
    title: 'Sertão Moderno',
    artist: 'Violeiros da Serra',
    album: 'Caminhos do Sol',
    duration: 205,
    genre: 'Sertanejo',
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_51726a42ec.mp3?filename=acoustic-bossa-10330.mp3',
    lyrics: [
      { time: 0, text: 'Poeira subindo na estrada real' },
      { time: 22, text: 'Violão tocando no meu quintal' }
    ]
  }
];

const GENRES = ['Todos', 'Pop', 'Rock', 'Eletrônica', 'Jazz', 'Sertanejo', 'MPB', 'Hip-Hop'];

export default function SonicPulseApp() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [showLyrics, setShowLyrics] = useState(false);

  // Music state
  const [tracks] = useState(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedTrackIds, setLikedTrackIds] = useState(['1', '3']);

  // Playlists
  const [userPlaylists, setUserPlaylists] = useState([
    { id: 'p1', name: 'Favoritas do Fim de Semana', trackIds: ['1', '2', '3'] },
    { id: 'p2', name: 'Foco & Trabalho', trackIds: ['4'] }
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Media Controls wrapped with useCallback
  const handleNextTrack = useCallback(() => {
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  }, [isShuffle, currentTrackIndex, tracks.length]);

  const handlePrevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  // Audio HTML5 player binding
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat, handleNextTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleLike = (trackId) => {
    setLikedTrackIds(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleCreatePlaylist = () => {
    const name = prompt('Nome da nova playlist:');
    if (name) {
      const newPl = {
        id: `p_${Date.now()}`,
        name,
        trackIds: []
      };
      setUserPlaylists([...userPlaylists, newPl]);
    }
  };

  // Filtered tracks for display
  const filteredTracks = tracks.filter(t => {
    const matchesQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'Todos' || t.genre === selectedGenre;
    return matchesQuery && matchesGenre;
  });

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-white font-sans overflow-hidden select-none">
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="auto" />

      {/* Sidebar Left */}
      <aside className="w-64 bg-[#121212] p-4 flex flex-col gap-6 border-r border-[#1E1E1E] flex-shrink-0">
        <div className="flex items-center gap-2 text-[#0066FF] px-2">
          <Sparkles className="w-8 h-8 text-[#00F0FF]" />
          <span className="text-xl font-bold tracking-wider text-white">Sonic<span className="text-[#0066FF]">Pulse</span></span>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => { setActiveTab('home'); setSelectedPlaylist(null); }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${activeTab === 'home' && !selectedPlaylist ? 'bg-[#0066FF] text-white font-semibold' : 'text-[#B3B3B3] hover:text-white hover:bg-[#1E1E1E]'}`}
          >
            <Home className="w-5 h-5" />
            Início
          </button>
          <button
            onClick={() => { setActiveTab('search'); setSelectedPlaylist(null); }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${activeTab === 'search' && !selectedPlaylist ? 'bg-[#0066FF] text-white font-semibold' : 'text-[#B3B3B3] hover:text-white hover:bg-[#1E1E1E]'}`}
          >
            <Search className="w-5 h-5" />
            Buscar
          </button>
          <button
            onClick={() => { setActiveTab('library'); setSelectedPlaylist(null); }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${activeTab === 'library' && !selectedPlaylist ? 'bg-[#0066FF] text-white font-semibold' : 'text-[#B3B3B3] hover:text-white hover:bg-[#1E1E1E]'}`}
          >
            <Library className="w-5 h-5" />
            Sua Biblioteca
          </button>
        </nav>

        <hr className="border-[#1E1E1E]" />

        {/* Playlists List */}
        <div className="flex flex-col flex-1 overflow-y-auto gap-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs uppercase tracking-widest text-[#B3B3B3] font-bold">Minhas Playlists</span>
            <button onClick={handleCreatePlaylist} className="p-1 hover:bg-[#1E1E1E] rounded-full text-[#00F0FF]">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {userPlaylists.map(pl => (
            <button
              key={pl.id}
              onClick={() => { setSelectedPlaylist(pl); setActiveTab('playlist'); }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition ${selectedPlaylist?.id === pl.id ? 'bg-[#1E1E1E] text-[#00F0FF]' : 'text-[#B3B3B3] hover:text-white hover:bg-[#181818]'}`}
            >
              <ListMusic className="w-4 h-4 text-[#FF0033]" />
              <span className="truncate">{pl.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-[#181818] to-[#0D0D0D] p-6">
        {/* Top Search / Category Header */}
        {activeTab === 'search' && (
          <div className="mb-6 flex flex-col gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 w-5 h-5 text-[#B3B3B3]" />
              <input
                type="text"
                placeholder="O que você quer ouvir?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121212] border border-[#1E1E1E] text-white pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${selectedGenre === g ? 'bg-[#0066FF] text-white' : 'bg-[#121212] text-[#B3B3B3] hover:bg-[#1E1E1E]'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Content Views */}
        {selectedPlaylist ? (
          <div>
            <h1 className="text-3xl font-bold mb-2">{selectedPlaylist.name}</h1>
            <p className="text-sm text-[#B3B3B3] mb-6">{selectedPlaylist.trackIds.length} Músicas</p>
            <div className="flex flex-col gap-2">
              {tracks.filter(t => selectedPlaylist.trackIds.includes(t.id)).map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => { setCurrentTrackIndex(tracks.findIndex(t => t.id === track.id)); setIsPlaying(true); }}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#121212] hover:bg-[#1E1E1E] cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[#B3B3B3] w-6">{idx + 1}</span>
                    <img src={track.cover} alt={track.title} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="font-semibold text-white group-hover:text-[#00F0FF]">{track.title}</p>
                      <p className="text-xs text-[#B3B3B3]">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#B3B3B3]">{formatTime(track.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Banner Section */}
            <div className="relative rounded-2xl p-8 mb-8 overflow-hidden bg-gradient-to-r from-[#0066FF] to-[#FF0033]">
              <div className="relative z-10 max-w-lg">
                <span className="text-xs uppercase font-bold tracking-widest text-white/80">Destaque da Semana</span>
                <h1 className="text-4xl font-extrabold mt-1 mb-3">Cybernetic Echoes</h1>
                <p className="text-sm text-white/90 mb-6">Ouça o novo álbum sintético de Neon Dreams com exclusivo suporte a áudio espacial.</p>
                <button
                  onClick={() => { setCurrentTrackIndex(0); setIsPlaying(true); }}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition shadow-lg"
                >
                  <Play className="w-5 h-5 fill-black" /> Tocar Agora
                </button>
              </div>
            </div>

            {/* Track Catalog */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#00F0FF]" /> Tocadas Recentemente
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredTracks.map(track => (
                <div
                  key={track.id}
                  onClick={() => { setCurrentTrackIndex(tracks.findIndex(t => t.id === track.id)); setIsPlaying(true); }}
                  className="bg-[#121212] p-4 rounded-xl hover:bg-[#1E1E1E] transition cursor-pointer group flex flex-col"
                >
                  <div className="relative mb-3">
                    <img src={track.cover} alt={track.title} className="w-full aspect-square rounded-lg object-cover" />
                    <button className="absolute right-2 bottom-2 p-3 bg-[#FF0033] rounded-full opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0 shadow-xl">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-sm truncate text-white">{track.title}</h3>
                  <p className="text-xs text-[#B3B3B3] truncate mt-1">{track.artist}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Synchronized Lyrics Drawer Right */}
      {showLyrics && (
        <aside className="w-80 bg-[#121212] border-l border-[#1E1E1E] p-6 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><Mic2 className="w-5 h-5 text-[#00F0FF]" /> Letra</h2>
            <button onClick={() => setShowLyrics(false)} className="text-xs text-[#B3B3B3] hover:text-white">Fechar</button>
          </div>
          <div className="flex flex-col gap-4 my-auto">
            {currentTrack.lyrics?.map((line, idx) => {
              const isCurrentLine = currentTime >= line.time && (idx === currentTrack.lyrics.length - 1 || currentTime < currentTrack.lyrics[idx + 1].time);
              return (
                <p
                  key={idx}
                  className={`text-base transition-all duration-300 font-medium ${isCurrentLine ? 'text-[#00F0FF] text-xl font-bold' : 'text-[#B3B3B3]'}`}
                >
                  {line.text}
                </p>
              );
            })}
          </div>
        </aside>
      )}

      {/* Footer Persistent Audio Player */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-[#0D0D0D] border-t border-[#1E1E1E] px-4 flex items-center justify-between z-50">
        {/* Currently Playing Track Info */}
        <div className="flex items-center gap-3 w-1/4">
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-14 h-14 rounded-lg object-cover" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-white">{currentTrack.title}</p>
            <p className="text-xs text-[#B3B3B3] truncate">{currentTrack.artist}</p>
          </div>
          <button onClick={() => toggleLike(currentTrack.id)} className="ml-2">
            <Heart className={`w-5 h-5 ${likedTrackIds.includes(currentTrack.id) ? 'text-[#FF0033] fill-[#FF0033]' : 'text-[#B3B3B3]'}`} />
          </button>
        </div>

        {/* Media Controls */}
        <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsShuffle(!isShuffle)} className={`transition ${isShuffle ? 'text-[#00F0FF]' : 'text-[#B3B3B3] hover:text-white'}`}>
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={handlePrevTrack} className="text-[#B3B3B3] hover:text-white transition">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={togglePlay} className="p-3 bg-[#FF0033] rounded-full hover:scale-105 transition shadow-md">
              {isPlaying ? <Pause className="w-5 h-5 text-white fill-white" /> : <Play className="w-5 h-5 text-white fill-white ml-0.5" />}
            </button>
            <button onClick={handleNextTrack} className="text-[#B3B3B3] hover:text-white transition">
              <SkipForward className="w-5 h-5" />
            </button>
            <button onClick={() => setIsRepeat(!isRepeat)} className={`transition ${isRepeat ? 'text-[#00F0FF]' : 'text-[#B3B3B3] hover:text-white'}`}>
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full text-xs text-[#B3B3B3]">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={currentTrack.duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-[#0066FF] h-1 bg-[#1E1E1E] rounded-lg cursor-pointer"
            />
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="flex items-center justify-end gap-4 w-1/4">
          <button onClick={() => setShowLyrics(!showLyrics)} className={`transition ${showLyrics ? 'text-[#00F0FF]' : 'text-[#B3B3B3] hover:text-white'}`}>
            <Mic2 className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-5 h-5 text-[#FF0033]" /> : <Volume2 className="w-5 h-5 text-[#B3B3B3]" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="w-20 accent-[#0066FF] h-1 bg-[#1E1E1E] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}