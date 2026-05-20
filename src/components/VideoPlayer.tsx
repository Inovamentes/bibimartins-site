import { PlayCircle } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export function parseVideoUrl(input: string): {
  embedUrl: string;
  type: 'youtube' | 'vimeo' | 'panda' | 'raw' | 'invalid';
} {
  if (!input) return { embedUrl: '', type: 'invalid' };

  const trimmed = input.trim();

  // 1. Check if it's full iframe code, e.g. <iframe src="xxx" ...>
  const iframeSrcMatch = trimmed.match(/src=["'](.*?)["']/i);
  const target = iframeSrcMatch ? iframeSrcMatch[1] : trimmed;

  // 2. YouTube
  if (target.includes('youtube.com') || target.includes('youtu.be')) {
    let videoId = '';
    if (target.includes('youtu.be/')) {
      videoId = target.split('youtu.be/')[1]?.split(/[?#]/)[0];
    } else if (target.includes('embed/')) {
      videoId = target.split('embed/')[1]?.split(/[?#]/)[0];
    } else {
      const urlParts = target.split('?');
      if (urlParts.length > 1) {
        const urlParams = new URLSearchParams(urlParts[1]);
        videoId = urlParams.get('v') || '';
      }
    }
    if (videoId) {
      return { embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`, type: 'youtube' };
    }
  }

  // 3. Vimeo
  if (target.includes('vimeo.com')) {
    let videoId = '';
    if (target.includes('player.vimeo.com/video/')) {
      videoId = target.split('player.vimeo.com/video/')[1]?.split(/[?#]/)[0];
    } else {
      const parts = target.split('/');
      videoId = parts[parts.length - 1]?.split(/[?#]/)[0];
    }
    if (videoId) {
      return { embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=0`, type: 'vimeo' };
    }
  }

  // 4. Panda Video
  if (target.includes('pandavideo.com.br')) {
    return { embedUrl: target, type: 'panda' };
  }

  // 5. Direct raw video file links (mp4, webm, etc.)
  if (target.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
    return { embedUrl: target, type: 'raw' };
  }

  // 6. Check if it's a Panda Video ID (usually UUID format, e.g. 6ea12345-1234-1234-1234-123456789abc)
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(target);
  if (isUuid) {
    return { embedUrl: `https://embed.pandavideo.com.br/v1/?v=${target}`, type: 'panda' };
  }

  // 7. Check if it's a YouTube ID (11 characters)
  if (target.length === 11 && !target.includes(' ')) {
    return { embedUrl: `https://www.youtube.com/embed/${target}?autoplay=0&rel=0`, type: 'youtube' };
  }

  // 8. Check if it's a Vimeo ID (9 digits)
  if (/^\d{9}$/.test(target)) {
    return { embedUrl: `https://player.vimeo.com/video/${target}?autoplay=0`, type: 'vimeo' };
  }

  // If it starts with http or https, default to raw url
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return { embedUrl: target, type: 'raw' };
  }

  return { embedUrl: '', type: 'invalid' };
}

export default function VideoPlayer({ videoUrl, title = 'Vídeo Aula', className = '' }: VideoPlayerProps) {
  const { embedUrl, type } = parseVideoUrl(videoUrl);

  if (type === 'invalid' || !embedUrl) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-900/60 backdrop-blur-sm rounded-2xl ${className}`}>
        <PlayCircle className="w-16 h-16 mb-4 opacity-20 text-orange-500 animate-pulse" />
        <p className="text-sm font-medium">Vídeo não disponível ou link inválido.</p>
        <p className="text-xs text-gray-600 mt-1">Insira um link do YouTube, Vimeo ou Panda Video</p>
      </div>
    );
  }

  if (type === 'raw') {
    return (
      <div className={`relative w-full h-full bg-black overflow-hidden rounded-2xl ${className}`}>
        <video
          className="w-full h-full object-contain"
          controls
          playsInline
          src={embedUrl}
        />
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-black overflow-hidden rounded-2xl ${className}`}>
      <iframe
        className="w-full h-full"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}
