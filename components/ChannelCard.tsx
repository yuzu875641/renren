import Link from 'next/link';
import Image from 'next/image';

interface ChannelCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  subscribers: string;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ id, title, thumbnailUrl, subscribers }) => {
  return (
    <Link href={`/channel/${id}`} className="block">
      <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image src={thumbnailUrl} alt={title} layout="fill" objectFit="cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-gray-400 text-sm">{subscribers} 登録者</p>
        </div>
      </div>
    </Link>
  );
};

export default ChannelCard;
