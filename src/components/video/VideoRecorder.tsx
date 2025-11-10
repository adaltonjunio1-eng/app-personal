import { useRef, useState } from 'react';
import { Video, StopCircle, Play, Trash2, Upload } from 'lucide-react';
import { Button } from '../common/Button';
import './VideoRecorder.css';

interface VideoRecorderProps {
  onVideoSaved: (videoBlob: Blob, videoUrl: string) => void;
  existingVideoUrl?: string;
}

export function VideoRecorder({ onVideoSaved, existingVideoUrl }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(existingVideoUrl || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        onVideoSaved(blob, url);
        
        // Limpa o stream
        mediaStream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteVideo = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setRecordedVideoUrl(url);
      onVideoSaved(file, url);
    }
  };

  return (
    <div className="video-recorder">
      <div className="video-preview">
        <video
          ref={videoRef}
          className={`preview-video ${recordedVideoUrl && !isRecording ? 'recorded' : ''}`}
          controls={!!(recordedVideoUrl && !isRecording)}
          playsInline
          src={recordedVideoUrl || undefined}
        />
        
        {!recordedVideoUrl && !isRecording && (
          <div className="preview-placeholder">
            <Video size={48} />
            <p>Grave ou envie um vídeo</p>
          </div>
        )}
      </div>

      <div className="video-controls">
        {!recordedVideoUrl && !isRecording && (
          <>
            <Button
              variant="primary"
              icon={<Video size={18} />}
              onClick={startRecording}
            >
              Gravar Vídeo
            </Button>
            
            <label className="upload-btn">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <Button variant="ghost" icon={<Upload size={18} />}>
                Enviar Vídeo
              </Button>
            </label>
          </>
        )}

        {isRecording && (
          <Button
            variant="danger"
            icon={<StopCircle size={18} />}
            onClick={stopRecording}
          >
            Parar Gravação
          </Button>
        )}

        {recordedVideoUrl && !isRecording && (
          <div className="recorded-actions">
            <Button
              variant="ghost"
              icon={<Play size={18} />}
              onClick={() => videoRef.current?.play()}
            >
              Reproduzir
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 size={18} />}
              onClick={deleteVideo}
            >
              Excluir
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
