import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mentor } from '../types/mentor';
import { Clock, User, Star, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  onSelect: (mentor: Mentor) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const tagsArray = mentor.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  
  const truncatedDescription = mentor.descricao.length > 120 
    ? mentor.descricao.substring(0, 120) + '...'
    : mentor.descricao;

  return (
    <Card className={`group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
      !mentor.disponivel ? 'opacity-60' : 'hover:shadow-[#11AC5C]/20'
    } border-0 bg-white overflow-hidden relative`}>
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#11AC5C] via-[#0FCC7D] to-[#11AC5C] rounded-lg p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white rounded-md h-full w-full"></div>
      </div>
      
      <CardContent className="p-6 relative z-10">
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {mentor.disponivel ? (
            <Badge className="bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] text-white border-0 shadow-md">
              <Star className="w-3 h-3 mr-1" />
              Disponível
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              Ocupado
            </Badge>
          )}
        </div>

        {/* Photo and Header */}
        <div className="flex flex-col items-center text-center mb-6 mt-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-xl group-hover:ring-[#11AC5C]/30 transition-all duration-300">
            <img
              src={mentor.foto_url || "/placeholder.svg"}
              alt={mentor.nome}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#014837]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h3 className="font-bold text-xl text-[#014837] mb-2 group-hover:text-[#11AC5C] transition-colors duration-300">
            {mentor.nome}
          </h3>
          <div className="flex items-center text-[#11AC5C] mb-3">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] bg-clip-text text-transparent">
              {mentor.setor}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            {isExpanded ? mentor.descricao : truncatedDescription}
          </p>
          {mentor.descricao.length > 120 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center text-[#11AC5C] hover:text-[#014837] text-xs font-medium transition-colors duration-200"
            >
              {isExpanded ? (
                <>Ver menos <ChevronUp className="w-3 h-3 ml-1" /></>
              ) : (
                <>Ver mais <ChevronDown className="w-3 h-3 ml-1" /></>
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="mb-2">
            <span className="text-xs font-semibold text-[#014837] uppercase tracking-wider">Especialidades</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagsArray.slice(0, isExpanded ? tagsArray.length : 3).map((tag, index) => (
              <Badge 
                key={index} 
                className="bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] text-white border border-[#11AC5C]/30 hover:bg-gradient-to-r hover:from-[#014837] hover:to-[#11AC5C] hover:text-white hover:border-transparent hover:shadow-md transition-all duration-300 text-xs font-medium cursor-pointer transform hover:scale-105"
              >
                <span className="mr-1">•</span>
                {tag}
              </Badge>
            ))}
            {!isExpanded && tagsArray.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs border-[#11AC5C]/40 text-[#11AC5C] hover:bg-[#11AC5C]/10 transition-all duration-200 cursor-pointer font-medium"
                onClick={() => setIsExpanded(true)}
              >
                +{tagsArray.length - 3} mais
              </Badge>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <div className="flex items-center text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
            <Clock className="w-4 h-4 mr-2 text-[#11AC5C]" />
            <span className="font-medium">Disponibilidade:</span>
            <span className="ml-1 text-[#014837] font-semibold">{mentor.disponibilidade}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="w-full border-[#11AC5C]/30 text-[#11AC5C] hover:bg-[#11AC5C] hover:text-white transition-all duration-300 group/btn"
          >
            <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
            {isExpanded ? 'Ver Menos Detalhes' : 'Ver Mais Detalhes'}
          </Button>
          
          <Button
            onClick={() => onSelect(mentor)}
            disabled={!mentor.disponivel}
            className={`w-full transition-all duration-300 transform ${
              mentor.disponivel
                ? 'bg-gradient-to-r from-[#11AC5C] to-[#0FCC7D] hover:from-[#014837] hover:to-[#11AC5C] text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {mentor.disponivel ? (
              <>
                <Star className="w-4 h-4 mr-2" />
                Escolher Este Mentor
              </>
            ) : (
              'Não Disponível'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
