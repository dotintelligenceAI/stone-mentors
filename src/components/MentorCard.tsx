import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mentor } from '../types/mentor';
import { Clock, User, Star, Eye } from 'lucide-react';
import { MentorDetailsModal } from './MentorDetailsModal';

interface MentorCardProps {
  mentor: Mentor;
  onSelect: (mentor: Mentor) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onSelect }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  return (
    <>
      <Card className={`group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
        !mentor.disponivel ? 'opacity-60' : 'hover:shadow-impulso-light/20'
      } border-0 bg-white overflow-hidden relative`}>
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-impulso-dark via-impulso-light to-impulso-dark rounded-lg p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-md h-full w-full"></div>
        </div>
        
        <CardContent className="p-6 relative">
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {mentor.disponivel ? (
              <Badge className="bg-gradient-to-r from-impulso-dark to-impulso-light text-white border-0 shadow-md">
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
            <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-xl group-hover:ring-impulso-light/30 transition-all duration-300">
              <img
                src={mentor.foto_url || "/placeholder.svg"}
                alt={mentor.nome}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-impulso-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="font-bold text-xl text-impulso-dark mb-2 group-hover:text-impulso-light transition-colors duration-300">
              {mentor.nome}
            </h3>
            <div className="flex items-center text-impulso-light mb-3">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold bg-gradient-to-r from-impulso-dark to-impulso-light bg-clip-text text-transparent">
                {mentor.cargo_atual}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setIsDetailsModalOpen(true)}
              variant="outline"
              className="w-full border-impulso-light/30 text-impulso-light hover:bg-impulso-light hover:text-impulso-dark transition-all duration-300 group/btn"
            >
              <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
              Ver Detalhes
            </Button>
            
            <Button
              onClick={() => onSelect(mentor)}
              disabled={!mentor.disponivel}
              className={`w-full transition-all duration-300 transform ${
                mentor.disponivel
                  ? 'bg-gradient-to-r from-impulso-dark to-impulso-light hover:from-impulso-light hover:to-impulso-dark text-white shadow-lg hover:shadow-xl hover:scale-105'
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

      <MentorDetailsModal
        mentor={mentor}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
};
