export interface ExerciseTemplate {
  id: string;
  name: string;
  image: string; // URL da imagem do boneco
  category: 'cardio' | 'peito' | 'costas' | 'pernas' | 'ombros' | 'bracos' | 'abdomen';
  muscleGroup: string;
  defaultSets?: string;
  defaultReps?: string;
  defaultWeight?: string;
  description?: string;
}

// Função para gerar placeholder SVG com emoji de exercício
const createPlaceholder = (emoji: string, bg: string = '#1a1f2e') => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect fill="${bg}" width="200" height="200" rx="12"/>
      <text x="100" y="120" text-anchor="middle" font-size="80" fill="#00ff5e">${emoji}</text>
    </svg>
  `)}`;
};

export const exerciseLibrary: ExerciseTemplate[] = [
  // CARDIO
  {
    id: 'esteira',
    name: 'Esteira',
    image: createPlaceholder('🏃'),
    category: 'cardio',
    muscleGroup: 'Cardio',
    defaultSets: '1',
    defaultReps: '5 min, 110-140 bpm',
    description: 'Aquecimento cardiovascular'
  },
  {
    id: 'bicicleta',
    name: 'Bicicleta Ergométrica',
    image: createPlaceholder('🚴'),
    category: 'cardio',
    muscleGroup: 'Cardio',
    defaultSets: '1',
    defaultReps: '10 min',
    description: 'Aquecimento de baixo impacto'
  },
  
  // OMBROS
  {
    id: 'rotacao-bracos-frente',
    name: 'Rotação de braços para frente',
    image: createPlaceholder('💪'),
    category: 'ombros',
    muscleGroup: 'Deltoides Anterior',
    defaultSets: '2',
    defaultReps: '20',
    description: 'Aquecimento de ombros'
  },
  {
    id: 'rotacao-bracos-tras',
    name: 'Rotação de braços para trás',
    image: createPlaceholder('💪'),
    category: 'ombros',
    muscleGroup: 'Deltoides Posterior',
    defaultSets: '2',
    defaultReps: '20',
    description: 'Aquecimento de ombros'
  },
  {
    id: 'desenvolvimento-ombros',
    name: 'Desenvolvimento de Ombros',
    image: createPlaceholder('🏋️'),
    category: 'ombros',
    muscleGroup: 'Deltoides',
    defaultSets: '4',
    defaultReps: '10',
    defaultWeight: '12 kg',
    description: 'Exercício composto para ombros'
  },
  {
    id: 'elevacao-lateral',
    name: 'Elevação Lateral',
    image: createPlaceholder('💪'),
    category: 'ombros',
    muscleGroup: 'Deltoides Lateral',
    defaultSets: '3',
    defaultReps: '15',
    defaultWeight: '8 kg',
    description: 'Isolamento de deltoides lateral'
  },
  
  // PERNAS
  {
    id: 'elevacao-pernas-barra',
    name: 'Elevação lateral de pernas nas barras',
    image: createPlaceholder('🦵'),
    category: 'pernas',
    muscleGroup: 'Quadríceps/Abdutores',
    defaultSets: '4',
    defaultReps: '30',
    description: 'Fortalecimento de pernas e core'
  },
  {
    id: 'agachamento-livre',
    name: 'Agachamento Livre',
    image: createPlaceholder('🦵'),
    category: 'pernas',
    muscleGroup: 'Quadríceps/Glúteos',
    defaultSets: '4',
    defaultReps: '12',
    defaultWeight: '20 kg',
    description: 'Exercício fundamental para pernas'
  },
  {
    id: 'leg-press',
    name: 'Leg Press 45°',
    image: createPlaceholder('🦵'),
    category: 'pernas',
    muscleGroup: 'Quadríceps/Glúteos',
    defaultSets: '4',
    defaultReps: '15',
    defaultWeight: '80 kg',
    description: 'Exercício composto para pernas'
  },
  {
    id: 'cadeira-extensora',
    name: 'Cadeira Extensora',
    image: createPlaceholder('🦵'),
    category: 'pernas',
    muscleGroup: 'Quadríceps',
    defaultSets: '3',
    defaultReps: '15',
    defaultWeight: '35 kg',
    description: 'Isolamento de quadríceps'
  },
  {
    id: 'mesa-flexora',
    name: 'Mesa Flexora',
    image: createPlaceholder('🦵'),
    category: 'pernas',
    muscleGroup: 'Posteriores de coxa',
    defaultSets: '3',
    defaultReps: '15',
    defaultWeight: '30 kg',
    description: 'Isolamento de posteriores'
  },
  
  // COSTAS
  {
    id: 'supino-inclinado-rotacao',
    name: 'Supino inclinado com rotação',
    image: createPlaceholder('🦾'),
    category: 'costas',
    muscleGroup: 'Dorsais/Trapézio',
    defaultSets: '4',
    defaultReps: '12',
    defaultWeight: '14 kg',
    description: 'Trabalha costas superior e média'
  },
  {
    id: 'remada-curvada',
    name: 'Remada Curvada',
    image: createPlaceholder('🦾'),
    category: 'costas',
    muscleGroup: 'Dorsais',
    defaultSets: '4',
    defaultReps: '12',
    defaultWeight: '30 kg',
    description: 'Massa para costas'
  },
  {
    id: 'barra-fixa',
    name: 'Barra Fixa',
    image: createPlaceholder('🦾'),
    category: 'costas',
    muscleGroup: 'Dorsais/Bíceps',
    defaultSets: '3',
    defaultReps: '8-10',
    description: 'Exercício composto para costas'
  },
  {
    id: 'pulley-frente',
    name: 'Pulley Frente',
    image: createPlaceholder('🦾'),
    category: 'costas',
    muscleGroup: 'Dorsais',
    defaultSets: '4',
    defaultReps: '12',
    defaultWeight: '40 kg',
    description: 'Desenvolvimento de largura'
  },
  
  // PEITO
  {
    id: 'supino-plano-halteres',
    name: 'Supino plano com halteres',
    image: createPlaceholder('💪'),
    category: 'peito',
    muscleGroup: 'Peitoral/Tríceps',
    defaultSets: '4',
    defaultReps: '12',
    defaultWeight: '16 kg',
    description: 'Exercício composto para peito'
  },
  {
    id: 'supino-reto',
    name: 'Supino Reto',
    image: createPlaceholder('💪'),
    category: 'peito',
    muscleGroup: 'Peitoral',
    defaultSets: '4',
    defaultReps: '10',
    defaultWeight: '40 kg',
    description: 'Exercício principal para peito'
  },
  {
    id: 'crucifixo',
    name: 'Crucifixo',
    image: createPlaceholder('💪'),
    category: 'peito',
    muscleGroup: 'Peitoral',
    defaultSets: '3',
    defaultReps: '15',
    defaultWeight: '12 kg',
    description: 'Isolamento de peitoral'
  },
  {
    id: 'flexao',
    name: 'Flexão de Braço',
    image: createPlaceholder('💪'),
    category: 'peito',
    muscleGroup: 'Peitoral/Tríceps',
    defaultSets: '3',
    defaultReps: '20',
    description: 'Exercício com peso corporal'
  },
  
  // BRAÇOS
  {
    id: 'rosca-direta',
    name: 'Rosca Direta',
    image: createPlaceholder('💪'),
    category: 'bracos',
    muscleGroup: 'Bíceps',
    defaultSets: '3',
    defaultReps: '12',
    defaultWeight: '10 kg',
    description: 'Isolamento de bíceps'
  },
  {
    id: 'triceps-pulley',
    name: 'Tríceps na Polia',
    image: createPlaceholder('💪'),
    category: 'bracos',
    muscleGroup: 'Tríceps',
    defaultSets: '3',
    defaultReps: '15',
    defaultWeight: '25 kg',
    description: 'Isolamento de tríceps'
  },
  {
    id: 'rosca-martelo',
    name: 'Rosca Martelo',
    image: createPlaceholder('💪'),
    category: 'bracos',
    muscleGroup: 'Bíceps/Braquial',
    defaultSets: '3',
    defaultReps: '12',
    defaultWeight: '10 kg',
    description: 'Trabalha bíceps e antebraço'
  },
  {
    id: 'triceps-testa',
    name: 'Tríceps Testa',
    image: createPlaceholder('💪'),
    category: 'bracos',
    muscleGroup: 'Tríceps',
    defaultSets: '3',
    defaultReps: '12',
    defaultWeight: '20 kg',
    description: 'Isolamento de tríceps'
  },
  
  // ABDÔMEN
  {
    id: 'abdominal-remador',
    name: 'Abdominal no Remador',
    image: createPlaceholder('🔥'),
    category: 'abdomen',
    muscleGroup: 'Abdômen',
    defaultSets: '3',
    defaultReps: '20',
    description: 'Fortalecimento abdominal'
  },
  {
    id: 'prancha',
    name: 'Prancha Isométrica',
    image: createPlaceholder('🔥'),
    category: 'abdomen',
    muscleGroup: 'Core',
    defaultSets: '3',
    defaultReps: '60 seg',
    description: 'Fortalecimento de core'
  },
  {
    id: 'abdominal-infra',
    name: 'Abdominal Infra',
    image: createPlaceholder('🔥'),
    category: 'abdomen',
    muscleGroup: 'Abdômen Inferior',
    defaultSets: '3',
    defaultReps: '20',
    description: 'Foco em abdômen inferior'
  },
  {
    id: 'abdominal-bicicleta',
    name: 'Abdominal Bicicleta',
    image: createPlaceholder('🔥'),
    category: 'abdomen',
    muscleGroup: 'Abdômen/Oblíquos',
    defaultSets: '3',
    defaultReps: '30',
    description: 'Trabalha rotação do tronco'
  },
];

export const exerciseCategories = [
  { id: 'all', label: 'Todos', icon: '💪' },
  { id: 'cardio', label: 'Cardio', icon: '🏃' },
  { id: 'peito', label: 'Peito', icon: '💪' },
  { id: 'costas', label: 'Costas', icon: '🦾' },
  { id: 'pernas', label: 'Pernas', icon: '🦵' },
  { id: 'ombros', label: 'Ombros', icon: '💪' },
  { id: 'bracos', label: 'Braços', icon: '💪' },
  { id: 'abdomen', label: 'Abdômen', icon: '🔥' },
];
