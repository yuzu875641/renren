import Link from 'next/link';
import Image from 'next/image';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  author: string;
  views: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ id, title, thumbnailUrl, author, views }) => {
  return (
    <Link href={`/watch?v=${id}`} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200">
        <div className="relative w-full h-48">
          <Image src={thumbnailUrl} alt={title} layout="fill" objectFit="cover" />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold truncate">{title}</h2>
          <p className="text-gray-400 text-sm">{author}</p>
          <p className="text-gray-400 text-sm">{views} 回視聴</p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
