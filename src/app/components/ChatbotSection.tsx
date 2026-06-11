import { MessageCircle } from 'lucide-react';

export function ChatbotSection() {
  return (
    <section id="assistencia" className="mb-12">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="text-[#c8d96f]" size={32} />
          <h2 className="text-3xl font-bold">Assistência ao Cliente</h2>
        </div>

        <div className="w-full rounded-xl overflow-hidden" style={{ height: '560px' }}>
          <iframe
            src="https://landbot.online/v3/H-3385931-GT68F8WY40D3RHQ5/index.html"
            title="SOVE Assistente Virtual"
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block' }}
            allow="microphone; camera"
          />
        </div>
      </div>
    </section>
  );
}
