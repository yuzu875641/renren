interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <video
      className="w-full rounded-lg"
      src={url}
      controls
      autoPlay
      playsInline
      poster="/placeholder-thumbnail.png"
    >
      お使いのブラウザは動画タグをサポートしていません。
    </video>
  );
};

export default VideoPlayer;
