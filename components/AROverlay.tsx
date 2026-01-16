
import React, { useEffect, useRef, useState } from 'react';
import { RefreshCcw, AlertCircle, Loader2, Camera, Sparkles, UserCheck } from 'lucide-react';

interface AROverlayProps {
  glassesImageUrl: string;
}

const FALLBACK_GLASSES = "https://i.ibb.co/L5QzX0w/glasses-overlay.png";

const AROverlay: React.FC<AROverlayProps> = ({ glassesImageUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glassesImageRef = useRef<HTMLImageElement | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isAiReady, setIsAiReady] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const faceLandmarksRef = useRef<any>(null);
  const rafIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    // Siempre priorizamos la imagen de las gafas sobre el fallback
    img.src = glassesImageUrl || FALLBACK_GLASSES;
    
    img.onload = () => {
      glassesImageRef.current = img;
    };
    img.onerror = () => {
      console.warn("Error cargando recurso AR, usando respaldo.");
      img.src = FALLBACK_GLASSES;
    };
  }, [glassesImageUrl]);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    setNeedsInteraction(false);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setIsLoading(false);
            startRendering();
          } catch (err) {
            setNeedsInteraction(true);
            setIsLoading(false);
          }
        };
      }
    } catch (err) {
      setError("Acceso denegado. Se requiere cámara para el probador virtual.");
      setIsLoading(false);
    }
  };

  const startRendering = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    const render = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        rafIdRef.current = requestAnimationFrame(render);
        return;
      }
      
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const vW = video.videoWidth;
      const vH = video.videoHeight;
      const cW = canvas.width;
      const cH = canvas.height;

      ctx.save();
      ctx.translate(cW, 0);
      ctx.scale(-1, 1);
      
      const vRatio = vW / vH;
      const cRatio = cW / cH;
      let sw, sh, sx, sy;
      
      if (vRatio > cRatio) {
        sw = vH * cRatio; sh = vH; sx = (vW - sw) / 2; sy = 0;
      } else {
        sw = vW; sh = vW / cRatio; sx = 0; sy = (vH - sh) / 2;
      }
      
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cW, cH);

      if (faceLandmarksRef.current && glassesImageRef.current) {
        const landmarks = faceLandmarksRef.current;
        
        // Puntos anatómicos optimizados para AR
        const bridge = landmarks[168]; 
        const leftTemple = landmarks[127]; 
        const rightTemple = landmarks[356]; 

        const getX = (l: any) => ((l.x * vW - sx) / sw) * cW;
        const getY = (l: any) => ((l.y * vH - sy) / sh) * cH;

        const bX = getX(bridge);
        const bY = getY(bridge);
        const lX = getX(leftTemple);
        const lY = getY(leftTemple);
        const rX = getX(rightTemple);
        const rY = getY(rightTemple);

        // El ancho se calcula basado en la distancia entre sienes con un margen del 12%
        const gWidth = Math.abs(rX - lX) * 1.12; 
        const gHeight = gWidth * 0.45; // Ratio dinámico de montura
        const angle = Math.atan2(rY - lY, rX - lX);

        ctx.translate(bX, bY);
        ctx.rotate(angle);
        
        // Efecto de brillo sutil en el cristal
        ctx.globalAlpha = 0.95;
        ctx.drawImage(
          glassesImageRef.current, 
          -gWidth / 2, 
          -gHeight / 2.15, // Ajuste para calzar en el puente nasal
          gWidth, 
          gHeight
        );
      }
      ctx.restore();

      rafIdRef.current = requestAnimationFrame(render);
    };

    render();
  };

  useEffect(() => {
    startCamera();

    const initAi = async () => {
      if ((window as any).FaceMesh) {
        const faceMesh = new (window as any).FaceMesh({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });
        
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6
        });

        faceMesh.onResults((results: any) => {
          if (results.multiFaceLandmarks?.length > 0) {
            faceLandmarksRef.current = results.multiFaceLandmarks[0];
            setIsFaceDetected(true);
          } else {
            faceLandmarksRef.current = null;
            setIsFaceDetected(false);
          }
        });

        const loopAi = async () => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            try { await faceMesh.send({ image: videoRef.current }); } catch(e) {}
          }
          if (streamRef.current) setTimeout(loopAi, 33);
        };
        
        loopAi();
        setIsAiReady(true);
      } else {
        setTimeout(initAi, 500);
      }
    };

    initAi();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div className="relative w-full max-w-[340px] mx-auto overflow-hidden rounded-[3.5rem] bg-black aspect-[9/16] shadow-2xl border-[10px] border-[#111]">
      <video ref={videoRef} style={{ display: 'none' }} playsInline muted autoPlay />
      <canvas ref={canvasRef} width={720} height={1280} className="w-full h-full object-cover" />
      
      {(isLoading || !isAiReady) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
          <Loader2 className="animate-spin text-via-red mb-4" size={32} />
          <p className="text-[9px] font-black tracking-widest uppercase text-white/40">Sincronizando Probador...</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="absolute top-10 inset-x-0 flex justify-center z-10">
            <div className={`px-4 py-2 rounded-full border backdrop-blur-md flex items-center gap-3 transition-all duration-500 ${isFaceDetected ? 'bg-black/50 border-white/20' : 'bg-via-red/90 border-transparent shadow-xl'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isFaceDetected ? 'bg-green-400' : 'bg-white animate-pulse'}`} />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">
                {isFaceDetected ? 'Probador Activo' : 'Buscando rostro'}
              </span>
            </div>
          </div>

          <div className="absolute bottom-12 inset-x-0 px-8 flex flex-col gap-4 z-10">
            <button 
              onClick={() => {
                if (!canvasRef.current) return;
                const link = document.createElement('a');
                link.download = `via-optic-look.png`;
                link.href = canvasRef.current.toDataURL('image/png');
                link.click();
              }}
              disabled={!isFaceDetected}
              className={`w-full h-16 rounded-3xl font-black flex items-center justify-center gap-3 transition-all ${isFaceDetected ? 'bg-white text-black active:scale-95 shadow-xl' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
            >
              <Camera size={20} />
              <span className="text-[10px] uppercase tracking-widest">Capturar Estilo</span>
            </button>
          </div>
        </>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-white p-8 text-center z-30">
          <AlertCircle className="text-via-red mb-4" size={40} />
          <p className="text-[10px] font-black mb-6 uppercase tracking-widest">{error}</p>
          <button onClick={startCamera} className="bg-via-red text-white px-8 py-3 rounded-full text-[9px] font-black uppercase">Reintentar</button>
        </div>
      )}
    </div>
  );
};

export default AROverlay;
