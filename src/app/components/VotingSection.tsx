import { useState } from 'react';
import { Vote, CheckCircle, Shield } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  party: string;
  number: string;
}

const candidates: Candidate[] = [
  { id: 1, name: 'Candidato A', party: 'Partido 1', number: '10' },
  { id: 2, name: 'Candidato B', party: 'Partido 2', number: '20' },
  { id: 3, name: 'Candidato C', party: 'Partido 3', number: '30' },
  { id: 4, name: 'Candidato D', party: 'Partido 4', number: '40' },
];

export function VotingSection() {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);

  const handleVote = () => {
    if (selectedCandidate !== null) {
      setVoted(true);
      setTimeout(() => {
        setVoted(false);
        setSelectedCandidate(null);
      }, 3000);
    }
  };

  return (
    <section id="votar" className="mb-12">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Vote className="text-[#c8d96f]" size={32} />
          <h2 className="text-3xl font-bold">Vote Agora</h2>
        </div>

        {voted ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">Voto Registado com Sucesso!</h3>
            <p className="text-gray-300">Obrigado por participar no processo democrático.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate.id)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    selectedCandidate === candidate.id
                      ? 'bg-[#c8d96f] text-[#0d3440] shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10 border border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-3xl font-bold w-16 h-16 rounded-full flex items-center justify-center ${
                        selectedCandidate === candidate.id
                          ? 'bg-[#0d3440] text-[#c8d96f]'
                          : 'bg-[#c8d96f] text-[#0d3440]'
                      }`}
                    >
                      {candidate.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{candidate.name}</h3>
                      <p className={selectedCandidate === candidate.id ? 'text-[#0d3440]' : 'text-gray-300'}>
                        {candidate.party}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleVote}
              disabled={selectedCandidate === null}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedCandidate !== null
                  ? 'bg-[#c8d96f] text-[#0d3440] hover:bg-[#d4e07f] shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirmar Voto
            </button>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-300">
              <Shield size={16} />
              <p>Seu voto é seguro, criptografado e anónimo</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
