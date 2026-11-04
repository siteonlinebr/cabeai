import { EditorialArticle } from '../types';

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    id: 'como-medir-espaco-sofa',
    slug: 'como-medir-espaco-sofa',
    title: 'Como medir corretamente o espaço para comprar um sofá',
    subtitle: 'Do vão da parede até a abertura do mecanismo retrátil: o guia definitivo para não errar.',
    category: 'Móveis & Salas',
    readingTimeMinutes: 5,
    publishedDate: '12 de Outubro de 2026',
    coverAccent: '#F3EDE2',
    summary: 'Aprenda a medir a largura da parede considerando rodapés e tomadas, além de planejar a circulação mínima de 60 cm para mesinhas de centro.',
    relatedCategory: 'sofas',
    content: [
      {
        heading: '1. O erro mais comum: medir na altura do chão',
        paragraphs: [
          'Quase toda parede residencial no Brasil possui rodapé de madeira, porcelanato ou poliestireno, que projeta entre 1,5 cm e 2,5 cm para dentro do cômodo de cada lado. Se você medir a parede no meio da altura e esquecer do rodapé, um sofá sob medida de 230 cm simplesmente não encostará no piso sem forçar a alvenaria.',
          'Além disso, observe o alinhamento das tomadas e interruptores de luz. Se a tomada do abajur ou do carregador de celular ficar exatamente atrás do braço do sofá, você precisará de 3 a 5 cm extras ou de um plugue em 90 graus (achatado).',
        ],
        callout: {
          type: 'rule',
          text: 'Regra de Ouro: Sempre meça a largura no piso (entre rodapés) e na altura do encosto (cerca de 90 cm do chão), pois paredes nem sempre são 100% aprumadas.',
        },
      },
      {
        heading: '2. Sofás retráteis e reclináveis: a profundidade dupla',
        paragraphs: [
          'Um sofá retrátil comum possui duas medidas vitais de profundidade: fechado (geralmente entre 95 cm e 110 cm) e totalmente aberto (que pode chegar a 160 cm a 180 cm).',
          'Muitas pessoas esquecem que, mesmo quando aberto, ainda é necessário existir uma passagem para quem vai ao banheiro ou à cozinha sem precisar pular sobre os assentos.',
        ],
        checklist: [
          'Meça o espaço com o sofá fechado e com o assento 100% estendido.',
          'Reserve no mínimo 50 cm a 60 cm entre a ponta do sofá aberto e o rack da TV.',
          'Verifique se o encosto reclinável necessita de espaço atrás (alguns modelos exigem 15 cm de distância da parede para reclinar).',
        ],
      },
      {
        heading: '3. Circulação e a regra dos 60 centímetros',
        paragraphs: [
          'Segundo os parâmetros de ergonomia arquitetônica e a NBR 15575 de desempenho habitacional, a faixa mínima para a passagem desimpedida de um adulto de frente é de 60 cm. Faixas de 45 cm são toleráveis apenas como passagem secundária e de lado.',
        ],
      },
    ],
  },
  {
    id: 'geladeira-passa-porta-cozinha',
    slug: 'geladeira-passa-porta-cozinha',
    title: 'Como saber se uma geladeira passa pela porta da cozinha',
    subtitle: 'O vão livre real, o ângulo de 90 graus da folha da porta e as folgas de ventilação do compressor.',
    category: 'Eletrodomésticos',
    readingTimeMinutes: 6,
    publishedDate: '18 de Outubro de 2026',
    coverAccent: '#E7F0EB',
    summary: 'Portas de 80 cm nem sempre entregam 80 cm de passagem. Entenda como medir o vão livre e calcular a dissipação térmica da geladeira.',
    relatedCategory: 'geladeiras',
    content: [
      {
        heading: '1. O vão nominal versus o vão livre da porta',
        paragraphs: [
          'Uma porta padrão comercializada no Brasil como "porta de 80 cm" refere-se à largura da folha de madeira. No entanto, quando a porta está instalada e aberta em 90 graus, a própria espessura da folha (3,5 cm) e a maçaneta saliente reduzem o vão livre real de passagem para cerca de 74 cm a 76 cm.',
          'Geladeiras modernas Frost Free de grande capacidade ou modelos French Door frequentemente possuem profundidade de 75 cm a 82 cm com os puxadores. Se a sua porta tiver vão livre de 75 cm, o eletrodoméstico simplesmente não entra sem desmontar as portas.',
        ],
        checklist: [
          'Abra a porta em 90 graus e passe a trena entre a face interna do batente e a quina da folha aberta.',
          'Considere se a porta pode ser desparafusada das dobradiças caso faltem 3 ou 4 cm.',
          'Verifique se as portas da geladeira podem ser removidas pela equipe de entrega.',
        ],
      },
      {
        heading: '2. Folgas obrigatórias de ventilação e garantia',
        paragraphs: [
          'Colocar uma geladeira em um nicho de marcenaria sem folga é a principal causa de queima prematura de compressor e aumento drástico na conta de energia. Os manuais de fabricantes como Brastemp, Consul e Electrolux são enfáticos:',
        ],
        checklist: [
          'Laterais: no mínimo 5 cm a 10 cm livres de cada lado.',
          'Fundo / Traseira: no mínimo 10 cm livres para a troca de calor do condensador.',
          'Topo / Teto: no mínimo 10 cm a 15 cm livres para exaustão do ar quente.',
        ],
        callout: {
          type: 'warning',
          text: 'Atenção com nichos planejados: a garantia de fábrica pode ser invalidada se o laudo técnico constatar superaquecimento por falta de folgas de ventilação.',
        },
      },
    ],
  },
  {
    id: 'o-que-medir-maquina-de-lavar',
    slug: 'o-que-medir-maquina-de-lavar',
    title: 'O que medir antes de comprar uma máquina de lavar',
    subtitle: 'Vibração da centrifugação, mangueira de esgoto e abertura superior vs frontal.',
    category: 'Lavanderia',
    readingTimeMinutes: 4,
    publishedDate: '24 de Outubro de 2026',
    coverAccent: '#E9EEF4',
    summary: 'Aprenda os segredos do espaço da lavanderia: por que deixar 5 cm de cada lado para a vibração e como checar o ponto hidráulico.',
    relatedCategory: 'maquinas',
    content: [
      {
        heading: '1. A centrifugação e a folga dinâmica',
        paragraphs: [
          'Diferente de um armário, uma máquina de lavar roupa é um equipamento com motor rotativo de alta velocidade (até 1400 RPM). Durante a centrifugação, ocorre oscilação mecânica natural do cesto.',
          'Se você encaixar a máquina rente à parede ou ao tanque de lavar roupas, o atrito contínuo provocará ruídos estridentes, danos ao gabinete da lavadora e rachaduras no revestimento cerâmico.',
        ],
        checklist: [
          'Deixe pelo menos 5 cm livres de cada lateral.',
          'Deixe de 8 a 10 cm atrás para a curva das mangueiras de entrada e saída.',
          'Verifique se o piso está nivelado (o desnível aumenta drasticamente a trepidação).',
        ],
      },
      {
        heading: '2. Abertura superior (Top Load) vs Frontal (Front Load)',
        paragraphs: [
          'Se você possui armário aéreo ou varal de teto logo acima da lavadora, um modelo Top Load (com tampa superior) exige pelo menos 50 cm a 60 cm de altura livre acima da máquina para permitir abrir a tampa completamente.',
          'Já modelos Front Load (abertura frontal) exigem cerca de 55 cm livres na frente para abrir o visor de vidro e colocar o cesto de roupas.',
        ],
      },
    ],
  },
  {
    id: 'circulacao-ideal-entre-moveis',
    slug: 'circulacao-ideal-entre-moveis',
    title: 'Como calcular a circulação ideal entre móveis',
    subtitle: 'Normas ergonômicas da arquitetura para salas, corredores e cozinhas respirarem.',
    category: 'Arquitetura & Ergonomia',
    readingTimeMinutes: 7,
    publishedDate: '28 de Outubro de 2026',
    coverAccent: '#E4EFE8',
    summary: 'Descubra as distâncias recomendadas entre sofá, rack de TV, mesa de jantar e armários para manter sua casa funcional e agradável.',
    relatedCategory: 'mesas',
    content: [
      {
        heading: '1. As distâncias essenciais de circulação',
        paragraphs: [
          'A sensação de uma casa "apertada" ou "ampla" raramente depende apenas da metragem quadrada total; depende do dimensionamento das áreas de circulação.',
          'Corredores principais de circulação entre cômodos pedem de 80 cm a 90 cm de largura desimpedida. Em áreas de estar íntimas, 60 cm são o mínimo recomendado para um caminhar natural.',
        ],
        checklist: [
          'Entre sofá e mesa de centro: 40 cm a 50 cm (distância para esticar as pernas e alcançar copos).',
          'Ao redor da mesa de jantar: 80 cm livres para puxar as cadeiras e sentar sem esbarrar na parede.',
          'Frente de guarda-roupa com portas de bater: largura da porta (50 cm) + 50 cm para o corpo da pessoa = 100 cm livres recomendados.',
          'Frente de gaveteiros e fornos: no mínimo 75 cm para abrir a gaveta e agachar com segurança.',
        ],
      },
    ],
  },
  {
    id: 'como-medir-quarto-cama-queen-king',
    slug: 'como-medir-quarto-cama-queen-king',
    title: 'Como medir um quarto antes de escolher uma cama Queen ou King',
    subtitle: 'Tamanhos padrão no Brasil, abertura das portas do guarda-roupa e circulação lateral.',
    category: 'Quartos',
    readingTimeMinutes: 5,
    publishedDate: '01 de Novembro de 2026',
    coverAccent: '#F2EBE5',
    summary: 'Comparativo completo entre Solteiro, Casal, Queen e King Size. Saiba se sobra espaço para circular e abrir os armários.',
    relatedCategory: 'camas',
    content: [
      {
        heading: '1. Guia de tamanhos de colchão no Brasil',
        paragraphs: [
          'No mercado brasileiro, as dimensões padrão são rigorosamente padronizadas pela ABNT:',
        ],
        checklist: [
          'Solteiro: 88 cm x 188 cm',
          'Casal Padrão: 138 cm x 188 cm',
          'Queen Size: 158 cm x 198 cm (+20 cm de largura que o casal)',
          'King Size: 193 cm x 203 cm (+55 cm de largura que o casal)',
        ],
        callout: {
          type: 'tip',
          text: 'Lembre-se da cabeceira! Se você escolher uma cabeceira estofada em painel ou com estrutura de madeira, adicione de 5 cm a 12 cm no comprimento total da cama.',
        },
      },
      {
        heading: '2. O teste da circulação lateral',
        paragraphs: [
          'Para que duas pessoas durmam confortavelmente sem precisar pular sobre o colchão, o quarto deve ter no mínimo 60 cm de passagem nas duas laterais da cama e 60 cm no pé da cama.',
          'Se o guarda-roupa fica em frente aos pés da cama, certifique-se de que a profundidade do quarto comporte os 198 cm da cama Queen + 60 cm de circulação + 60 cm do armário = mínimo de 318 cm de parede a parede.',
        ],
      },
    ],
  },
  {
    id: 'medidas-elevador-escada-mudanca',
    slug: 'medidas-elevador-escada-mudanca',
    title: 'Medidas de elevador e escada para evitar transtornos na entrega',
    subtitle: 'Por que o sofá cabe na sala mas não sobe pelo prédio: como calcular a diagonal da cabine.',
    category: 'Entrega & Logística',
    readingTimeMinutes: 6,
    publishedDate: '03 de Novembro de 2026',
    coverAccent: '#EDEAE4',
    summary: 'Aprenda a calcular a diagonal tridimensional do elevador e avaliar curvas de escadas e patamares antes de contratar o frete.',
    relatedCategory: 'outros',
    content: [
      {
        heading: '1. O mistério da cabine: o cálculo da diagonal 3D',
        paragraphs: [
          'Muitos sofás de 210 cm ou 230 cm de comprimento são mais compridos que a altura do teto do elevador (geralmente 210 cm a 220 cm) e mais compridos que a profundidade da cabine (geralmente 140 cm a 150 cm).',
          'Ainda assim, eles podem caber se forem posicionados na diagonal tridimensional da cabine (da quina inferior dianteira até a quina superior traseira oposta).',
          'Para um elevador de serviço padrão (110 cm de largura, 140 cm de profundidade e 220 cm de altura), a diagonal espacial útil atinge aproximadamente 283 cm. Descontando uma margem de manobra de 20 cm, objetos de até 260 cm podem caber se forem flexíveis o suficiente para entrar pela porta.',
        ],
        formula: 'Diagonal da Cabine = Raiz Quadrada(Largura² + Profundidade² + Altura²)',
      },
      {
        heading: '2. A porta do elevador é o primeiro gargalo',
        paragraphs: [
          'Não adianta a cabine ter 280 cm de diagonal se a porta de abertura telescópica abrir apenas 80 cm de vão. O objeto só entra se a sua menor seção transversal (geralmente a espessura do braço ou altura do encosto do sofá) for menor que os 80 cm da porta.',
        ],
        checklist: [
          'Meça o vão útil da porta aberta do elevador com a trena.',
          'Confira a altura livre interna da cabine até o painel de iluminação.',
          'Considere o peso máximo permitido pela administração do condomínio.',
          'Consulte as regras de horários e uso de acolchoado protetor de elevador.',
        ],
      },
    ],
  },
];
