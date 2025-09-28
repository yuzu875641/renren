import Link from 'next/link';
import Image from 'next/image';

interface LiveCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  author: string;
  viewCount: number;
}

const LiveCard: React.FC<LiveCardProps> = ({ id, title, thumbnailUrl, author, viewCount }) => {
  return (
    <Link href={`/watch?v=${id}`} className="block">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200">
        <div className="relative w-full h-48">
          <Image src={thumbnailUrl} alt={title} layout="fill" objectFit="cover" />
          <span className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">LIVE</span>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold truncate">{title}</h2>
          <p className="text-gray-400 text-sm">{author}</p>
          <p className="text-gray-400 text-sm">視聴者数: {viewCount}</p>
        </div>
      </div>
    </Link>
  );
};

export default LiveCard;
