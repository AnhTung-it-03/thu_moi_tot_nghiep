import { useEffect, useMemo, useRef, useState } from 'react';

const invitationImages = Array.from({ length: 8 }, (_, index) => `/img/${index + 1}.jpg`);
const youtubeVideoId = 'GgQFO8dL5XQ';
const youtubeStartSecond = 38;
const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?start=${youtubeStartSecond}&enablejsapi=1&rel=0&modestbranding=1&playsinline=1`;
const googleMapsQuery = encodeURIComponent('Trường Đại học Hồng Đức');
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;
const googleMapsEmbedUrl = `https://www.google.com/maps?q=${googleMapsQuery}&z=16&output=embed`;
const cardSoundUrl = '/sound/sound_hehe.mp3';

const invitationInfo = [
  { label: 'Thời gian', value: '7:00 - 10:00 sáng Thứ Hai, ngày 29/06/2026' },
  { label: 'Địa điểm', value: 'Sảnh chính trường đại học' },
  { label: 'Dress code', value: 'Thanh lịch, nhẹ nhàng, có thể chụp thật lâu' },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const cardAudioRef = useRef(null);

  const activeImage = useMemo(() => invitationImages[activeIndex], [activeIndex]);

  useEffect(() => {
    // Play card sound on page load
    if (cardAudioRef.current) {
      cardAudioRef.current.play().catch(() => {
        // Catch for browsers that block autoplay
      });
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % invitationImages.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadYouTubeApi = () => {
      if (window.YT?.Player) {
        return Promise.resolve(window.YT);
      }

      if (window.__youtubeIframeApiPromise) {
        return window.__youtubeIframeApiPromise;
      }

      window.__youtubeIframeApiPromise = new Promise((resolve) => {
        const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://www.youtube.com/iframe_api';
          script.async = true;
          document.body.appendChild(script);
        }

        const previousReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (typeof previousReady === 'function') {
            previousReady();
          }

          resolve(window.YT);
        };
      });

      return window.__youtubeIframeApiPromise;
    };

    async function createPlayer() {
      if (!playerHostRef.current || playerRef.current) {
        return;
      }

      const YT = await loadYouTubeApi();

      if (cancelled || !playerHostRef.current) {
        return;
      }

      playerRef.current = new YT.Player(playerHostRef.current, {
        videoId: youtubeVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start: youtubeStartSecond,
        },
        events: {
          onReady: (event) => {
            event.target.cueVideoById({ videoId: youtubeVideoId, startSeconds: youtubeStartSecond });
            setPlayerReady(true);
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === YT.PlayerState.PLAYING);
          },
        },
      });
    }

    createPlayer();

    return () => {
      cancelled = true;

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const handleNext = () => setActiveIndex((current) => (current + 1) % invitationImages.length);
  const handlePrev = () => setActiveIndex((current) => (current - 1 + invitationImages.length) % invitationImages.length);

  const handleMusicToggle = () => {
    const player = playerRef.current;

    if (!player || !playerReady) {
      return;
    }

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
      return;
    }

    const currentTime = typeof player.getCurrentTime === 'function' ? player.getCurrentTime() : 0;

    if (!currentTime || currentTime < youtubeStartSecond) {
      player.seekTo(youtubeStartSecond, true);
    }

    player.playVideo();
    setIsPlaying(true);
  };

  return (
    <main className="page-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="grain" />

      <section className="invitation-card">
        <header className="hero-panel">
          <div className="hero-overlay" />
          <img className="hero-image" src={activeImage} alt={`Khoảnh khắc kỷ yếu ${activeIndex + 1}`} />
          <div className="hero-badge">Kỷ yếu 2026</div>
          <div className="hero-copy">
            <p className="eyebrow" style={{ marginBottom: '10px' }}>Thanh xuân chỉ đến một lần</p>
            <h1 style={{ fontSize: '45px', height: '75px', fontFamily: 'times new roman'}}>Thư Mời lễ tốt nghiệp</h1>
            <p>
              Gửi bạn một ngày cuối cùng để gom đủ tiếng cười, ánh nhìn và những khoảnh khắc đẹp nhất của tuổi học trò.
            </p>
          </div>

          <div className="hero-controls">
            <button type="button" onClick={handlePrev} aria-label="Ảnh trước">
              ←
            </button>
            <button type="button" onClick={handleNext} aria-label="Ảnh tiếp theo">
              →
            </button>
          </div>
        </header>

        <section className="content-panel">
          <div className="info-strip">
            {invitationInfo.map((item) => (
              <article key={item.label} className="info-chip">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <div className="story-block">
            <p>
              Thời gian trôi rất nhanh. Trước khi mỗi người rẽ sang một hành trình mới, hãy cùng nhau giữ lại buổi chụp
              này như một dấu chấm đẹp cho thanh xuân.
            </p>
          </div>

          <div className="gallery-grid" aria-label="Album kỷ yếu">
            {invitationImages.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`gallery-item ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <img src={image} alt={`Khoảnh khắc ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="music-panel">
            <div>
              {/* <p className="music-label">Nhạc nền YouTube</p> */}
              <h2 style={{ fontSize: '24px', margin: '10px 0' }}>Thanh Xuân - Da LAB</h2>
              <p className="music-meta"></p>
            </div>

            <div className="music-actions">
              <button
                type="button"
                className={`play-button ${isPlaying ? 'is-playing' : ''}`}
                onClick={handleMusicToggle}
                aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc từ giây 38'}
                disabled={!playerReady}
              >
                <span className="play-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <audio src={cardSoundUrl} ref={cardAudioRef} preload="auto" />
          <div className="hidden-music-frame" aria-hidden="true" ref={playerHostRef} />

          <section className="map-panel">
            <div className="map-header">
              <div>
                <p className="music-label">Bản đồ</p>
                <h2>Trường Đại học Hồng Đức</h2>
                <p className="music-meta">Bấm vào địa chỉ để mở Google Maps hoặc xem ngay trên khung bản đồ bên dưới.</p>
              </div>
              <a className="map-link" href={googleMapsUrl} target="_blank" rel="noreferrer">
                Mở Google Maps
              </a>
            </div>

            <a className="map-address" href={googleMapsUrl} target="_blank" rel="noreferrer">
              Trường Đại học Hồng Đức
            </a>

            <div className="map-embed">
              <iframe
                title="Bản đồ Trường Đại học Hồng Đức"
                src={googleMapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;