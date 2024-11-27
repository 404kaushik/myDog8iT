import { Message } from '@/types';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isAI = message.role === 'assistant';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl 
                   ${isAI 
                     ? 'bg-gray-100 text-gray-900' 
                     : 'bg-black text-white'
                   }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}