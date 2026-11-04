import {
  Dimensions,
  FitCalculationResult,
  FitStatus,
  RoomClearances,
  DeliveryPath,
  DeliveryPathDiagnosis,
  PassageItemDiagnosis,
  PassageStatus,
} from '../types';

/**
 * Calculates whether a piece of furniture fits into a room space.
 * Real geometric validation with orientation testing and clearance math.
 */
export function calculateSpaceFit(
  productDim: Dimensions,
  spaceDim: Dimensions,
  clearances: RoomClearances = {
    minSideClearance: 0,
    circulationSpace: 0,
    ventilationClearance: 0,
  },
  isRotated: boolean = false
): FitCalculationResult {
  // Validate non-negative numbers
  const pW = Math.max(0, productDim.width);
  const pH = Math.max(0, productDim.height);
  const pD = Math.max(0, productDim.depth);

  const sW = Math.max(0, spaceDim.width);
  const sH = Math.max(0, spaceDim.height || 260); // default residential ceiling height
  const sD = Math.max(0, spaceDim.depth);

  if (pW <= 0 || pD <= 0 || sW <= 0 || sD <= 0) {
    return {
      status: 'does_not_fit',
      statusText: 'Medidas incompletas',
      statusDescription: 'Preencha largura e profundidade do móvel e do ambiente para calcular.',
      orientation: isRotated ? 'rotated_90' : 'standard',
      isRotated,
      canRotateToFit: false,
      productDimensions: productDim,
      spaceDimensions: spaceDim,
      effectiveRequiredWidth: 0,
      effectiveRequiredDepth: 0,
      effectiveRequiredHeight: 0,
      lateralClearance: 0,
      depthClearance: 0,
      verticalClearance: 0,
      warnings: ['Insira valores válidos acima de zero para calcular com precisão.'],
      recommendations: [],
      details: [],
    };
  }

  // Active footprint based on rotation (90° swaps width and depth on floor)
  const activeW = isRotated ? pD : pW;
  const activeD = isRotated ? pW : pD;
  const activeH = pH;

  // Clearances applied
  const requiredSideMargin = clearances.minSideClearance || 0;
  const requiredVentilation = clearances.ventilationClearance || 0;
  const requiredCirculation = clearances.circulationSpace || 0;

  // Total required space
  const totalRequiredW = activeW + (requiredSideMargin * 2) + (requiredVentilation * 2);
  const totalRequiredD = activeD + requiredCirculation + requiredVentilation;
  const totalRequiredH = activeH + requiredVentilation;

  // Clearances available
  const rawRemainingW = sW - activeW;
  const rawRemainingD = sD - activeD;
  const rawRemainingH = sH - activeH;

  const netRemainingW = sW - totalRequiredW;
  const netRemainingD = sD - totalRequiredD;
  const netRemainingH = sH - totalRequiredH;

  // Alternative rotation footprint test
  const altW = isRotated ? pW : pD;
  const altD = isRotated ? pD : pW;
  const altTotalRequiredW = altW + (requiredSideMargin * 2) + (requiredVentilation * 2);
  const altTotalRequiredD = altD + requiredCirculation + requiredVentilation;
  const altFitsGeometrically = altTotalRequiredW <= sW && altTotalRequiredD <= sD && totalRequiredH <= sH;

  // Evaluation
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let status: FitStatus = 'fits';
  let statusText = 'Cabe no espaço informado';
  let statusDescription = `${Math.round(rawRemainingW)} cm de folga lateral total`;

  // Check absolute geometric limits
  if (rawRemainingW < 0 || rawRemainingD < 0 || (spaceDim.height > 0 && rawRemainingH < 0)) {
    status = 'does_not_fit';
    statusText = 'Não cabe no espaço';
    
    if (rawRemainingW < 0) {
      warnings.push(`Largura do móvel (${activeW} cm) excede o espaço disponível (${sW} cm) em ${Math.abs(Math.round(rawRemainingW))} cm.`);
    }
    if (rawRemainingD < 0) {
      warnings.push(`Profundidade do móvel (${activeD} cm) excede o espaço disponível (${sD} cm) em ${Math.abs(Math.round(rawRemainingD))} cm.`);
    }
    if (spaceDim.height > 0 && rawRemainingH < 0) {
      warnings.push(`Altura do móvel (${activeH} cm) excede o pé-direito (${sH} cm) em ${Math.abs(Math.round(rawRemainingH))} cm.`);
    }

    if (altFitsGeometrically) {
      recommendations.push(`O móvel não cabe nesta posição, mas CABE se você rotacionar 90° (${altW} cm de frente x ${altD} cm de fundo).`);
    } else {
      recommendations.push('Considere um modelo com dimensões menores ou repense a disposição no ambiente.');
    }

    statusDescription = `Falta espaço: ${warnings[0] || 'dimensão incompatível'}`;
  } else if (netRemainingW < 0 || netRemainingD < 0 || (spaceDim.height > 0 && netRemainingH < 0)) {
    // Fits strictly, but violates requested clearances/ventilation
    status = 'fits_with_restrictions';
    statusText = 'Cabe com restrições';
    
    if (netRemainingW < 0) {
      warnings.push(`Folga lateral restante (${Math.round(rawRemainingW)} cm) é menor que a folga mínima/ventilação solicitada (${(requiredSideMargin * 2) + (requiredVentilation * 2)} cm).`);
    }
    if (netRemainingD < 0) {
      warnings.push(`Profundidade restante (${Math.round(rawRemainingD)} cm) não atende aos ${requiredCirculation + requiredVentilation} cm de circulação/ventilação recomendados.`);
    }
    if (spaceDim.height > 0 && netRemainingH < 0) {
      warnings.push(`Altura livre (${Math.round(rawRemainingH)} cm) é inferior à folga vertical de ventilação (${requiredVentilation} cm).`);
    }

    recommendations.push('O móvel entra fisicamente, mas a abertura de portas, circulação de pessoas ou dissipação térmica de eletros ficará comprometida.');
    statusDescription = `Espaço justo: ${Math.round(rawRemainingW)} cm de folga lateral, com restrições de circulação/ventilação`;
  } else {
    // Fits comfortably
    if (rawRemainingW < 10) {
      status = 'fits_with_restrictions';
      statusText = 'Cabe com folga mínima';
      warnings.push(`A folga lateral é bastante estreita (${Math.round(rawRemainingW)} cm no total). Meça com trena a laser ou fita metálica para evitar imprevistos com rodapés.`);
      statusDescription = `${Math.round(rawRemainingW)} cm de folga lateral (atenção a rodapés)`;
    } else {
      status = 'fits';
      statusText = 'Cabe no espaço informado';
      statusDescription = `${Math.round(rawRemainingW)} cm de folga lateral (${Math.round(rawRemainingW / 2)} cm de cada lado)`;
    }

    if (requiredCirculation > 0) {
      recommendations.push(`Circulação de ${requiredCirculation} cm preservada com folga adicional de ${Math.round(netRemainingD)} cm.`);
    }
  }

  const details = [
    {
      label: 'Folga lateral restante',
      value: `${Math.round(rawRemainingW)} cm (${Math.round(rawRemainingW / 2)} cm cada lado)`,
      status: (rawRemainingW >= 15 ? 'ok' : rawRemainingW >= 0 ? 'warning' : 'error') as 'ok' | 'warning' | 'error',
    },
    {
      label: 'Folga de profundidade',
      value: `${Math.round(rawRemainingD)} cm livres`,
      status: (rawRemainingD >= (requiredCirculation || 20) ? 'ok' : rawRemainingD >= 0 ? 'warning' : 'error') as 'ok' | 'warning' | 'error',
    },
    {
      label: 'Folga vertical (teto)',
      value: `${Math.round(rawRemainingH)} cm até o teto`,
      status: (rawRemainingH >= 10 ? 'ok' : rawRemainingH >= 0 ? 'warning' : 'error') as 'ok' | 'warning' | 'error',
    },
  ];

  return {
    status,
    statusText,
    statusDescription,
    orientation: isRotated ? 'rotated_90' : 'standard',
    isRotated,
    canRotateToFit: !isRotated && status === 'does_not_fit' && altFitsGeometrically,
    alternativeOrientationResult: {
      status: altFitsGeometrically ? 'fits' : 'does_not_fit',
      lateralClearance: sW - altW,
      depthClearance: sD - altD,
    },
    productDimensions: productDim,
    spaceDimensions: spaceDim,
    effectiveRequiredWidth: totalRequiredW,
    effectiveRequiredDepth: totalRequiredD,
    effectiveRequiredHeight: totalRequiredH,
    lateralClearance: rawRemainingW,
    depthClearance: rawRemainingD,
    verticalClearance: rawRemainingH,
    warnings,
    recommendations,
    details,
  };
}

/**
 * Diagnostic calculation for the delivery pathway:
 * Evaluates Doors, Corridors, Elevators, and Stairs.
 */
export function calculateDeliveryPath(
  productDim: Dimensions,
  packagingDim: Dimensions | undefined,
  path: DeliveryPath,
  evaluatePackaging: boolean = false
): DeliveryPathDiagnosis {
  const evalDim = evaluatePackaging && packagingDim && packagingDim.width > 0
    ? packagingDim
    : productDim;

  const w = evalDim.width;
  const h = evalDim.height;
  const d = evalDim.depth;

  // The 3 cross-sections of a 3D rectangular box:
  // 1. (w, d) - face down
  // 2. (w, h) - standing front
  // 3. (d, h) - sideways profile
  // Minimum 2 dimensions define whether it can pass through a 2D rectangular aperture:
  const dimsSorted = [w, h, d].sort((a, b) => a - b);
  const minDim = dimsSorted[0]; // smallest dimension (e.g. thickness/depth of sofa)
  const midDim = dimsSorted[1]; // middle dimension (e.g. height of sofa)
  const maxDim = dimsSorted[2]; // longest dimension (e.g. length 210cm)

  // 1. DOORWAY EVALUATION
  // Standard entry door: Wd x Hd. Door trim / handle often steals 3-5cm.
  const doorEffectiveW = path.door.removeDoorTrim ? path.door.width : path.door.width - 2;
  const doorEffectiveH = path.door.height;
  const doorDiagonal = Math.sqrt(Math.pow(doorEffectiveW, 2) + Math.pow(doorEffectiveH, 2));

  let doorStatus: PassageStatus = 'pass';
  let doorTitle = 'Passa pela porta';
  let doorDesc = '';
  const doorTips: string[] = [];
  const doorMargin = Math.round(doorEffectiveW - minDim);

  // Can it pass upright straight? (minDim <= doorW AND midDim <= doorH) OR (midDim <= doorW AND minDim <= doorH)
  if (minDim <= doorEffectiveW && midDim <= doorEffectiveH) {
    if (doorMargin >= 10) {
      doorStatus = 'pass';
      doorDesc = `O móvel passa com folga de ${doorMargin} cm virado na posição mais estreita (${minDim} cm).`;
    } else {
      doorStatus = 'pass_with_technique';
      doorDesc = `Passa com folga pequena (${doorMargin} cm). Manuseie com cuidado para não arranhar o batente da porta.`;
      doorTips.push('Proteja as quinas com plástico bolha ou cobertor de mudança.');
    }
  } else if (minDim <= doorEffectiveW && maxDim <= doorEffectiveH) {
    // Passes standing vertically
    doorStatus = 'pass_with_technique';
    doorDesc = `Passa na vertical (em pé), pois a altura da porta (${doorEffectiveH} cm) comporta o comprimento de ${maxDim} cm.`;
    doorTips.push('Transporte o móvel em pé para passar pela largura do batente.');
  } else if (minDim <= doorDiagonal && midDim <= doorEffectiveW + 15) {
    // Tilted diagonal passage
    doorStatus = 'pass_with_technique';
    doorDesc = 'Requer passagem inclinada (na diagonal) para vencer o vão da porta.';
    doorTips.push('Incline o móvel em 45 graus ao cruzar o batente.');
    doorTips.push('Se houver pés removíveis, desparafuse-os para ganhar até 10 cm livres.');
  } else {
    doorStatus = 'blocked';
    doorTitle = 'Não passa pela porta';
    doorDesc = `A menor dimensão do produto (${minDim} cm) excede o vão útil da porta (${doorEffectiveW} cm).`;
    doorTips.push('Verifique se a folha da porta pode ser retirada temporariamente das dobradiças.');
    doorTips.push('Verifique se o produto é desmontável ou se possui pés removíveis.');
    doorTips.push('Avalie içamento pela janela ou sacada se o imóvel tiver acesso externo.');
  }

  // 2. HALLWAY EVALUATION
  // Hallway width vs item minimum dimension and corner turn
  let hallwayStatus: PassageStatus = 'pass';
  let hallwayTitle = 'Passa pelo corredor';
  let hallwayDesc = '';
  const hallwayTips: string[] = [];
  const hallMargin = Math.round(path.hallway.width - minDim);

  if (minDim > path.hallway.width) {
    hallwayStatus = 'blocked';
    hallwayTitle = 'Não passa no corredor';
    hallwayDesc = `A largura do corredor (${path.hallway.width} cm) é menor que a menor espessura do móvel (${minDim} cm).`;
  } else if (path.hallway.hasCorner) {
    const cornerW = path.hallway.cornerWidth || path.hallway.width;
    // For a 90° corner turn:
    // If object length (maxDim) is greater than corridor width + corner width,
    // it cannot turn flat on the ground. It MUST be stood upright if ceiling allows.
    const maxHorizontalTurnLength = (path.hallway.width + cornerW) * 0.85; // practical threshold

    if (maxDim <= maxHorizontalTurnLength) {
      hallwayStatus = 'pass';
      hallwayDesc = `Passa pelo corredor e consegue fazer a curva de 90° na horizontal com folga de ${hallMargin} cm.`;
    } else if (maxDim <= path.hallway.ceilingHeight - 15) {
      hallwayStatus = 'pass_with_technique';
      hallwayDesc = `Curva de 90° apertada! O comprimento (${maxDim} cm) exige colocar o móvel em pé para girar a curva. O pé-direito de ${path.hallway.ceilingHeight} cm permite.`;
      hallwayTips.push('Ao chegar na curva do corredor, erga o móvel na vertical antes de girar.');
      hallwayTips.push('Verifique se há luminárias ou quadros na parede da curva que possam ser danificados.');
    } else {
      hallwayStatus = 'requires_onsite_inspection';
      hallwayTitle = 'Atenção crítica na curva do corredor';
      hallwayDesc = `O comprimento (${maxDim} cm) é maior que o giro horizontal e o pé-direito (${path.hallway.ceilingHeight} cm) é muito justo para erguê-lo na vertical.`;
      hallwayTips.push('Recomendamos verificação presencial rigorosa no local antes da entrega.');
      hallwayTips.push('Considere modelos bipartidos ou desmontáveis.');
    }
  } else {
    hallwayStatus = 'pass';
    hallwayDesc = `Corredor reto sem curvas: passagem livre com ${hallMargin} cm de folga lateral.`;
  }

  // 3. ELEVATOR EVALUATION
  let elevatorStatus: PassageStatus = 'pass';
  let elevatorTitle = 'Cabe no elevador';
  let elevatorDesc = '';
  const elevatorTips: string[] = [];

  // Door check
  const elevDoorPasses = minDim <= path.elevator.doorWidth && midDim <= path.elevator.doorHeight;
  // Internal volume
  const cabinDiagonal = Math.sqrt(
    Math.pow(path.elevator.cabinWidth, 2) +
    Math.pow(path.elevator.cabinDepth, 2) +
    Math.pow(path.elevator.cabinHeight, 2)
  );

  if (!elevDoorPasses && minDim > path.elevator.doorWidth) {
    elevatorStatus = 'blocked';
    elevatorTitle = 'Não entra pela porta do elevador';
    elevatorDesc = `A porta do elevador (${path.elevator.doorWidth} cm) é mais estreita que a menor dimensão (${minDim} cm).`;
    elevatorTips.push('Será necessário subir pela escada ou contratar içamento externo.');
  } else if (
    maxDim <= path.elevator.cabinHeight &&
    midDim <= path.elevator.cabinDepth &&
    minDim <= path.elevator.cabinWidth
  ) {
    elevatorStatus = 'pass';
    elevatorDesc = 'Cabe confortavelmente em pé ou deitado no elevador de serviço/social.';
  } else if (maxDim <= cabinDiagonal - 20) {
    // Fits diagonally inside cabin
    elevatorStatus = 'pass_with_technique';
    elevatorDesc = `Cabe inclinado na diagonal do elevador (${Math.round(cabinDiagonal)} cm de diagonal interna).`;
    elevatorTips.push('Posicione a base em um canto inferior e aponte o topo para o canto superior oposto da cabine.');
    elevatorTips.push('Coloque papelão no espelho ou painel do elevador para proteger as paredes.');
  } else {
    elevatorStatus = 'blocked';
    elevatorTitle = 'Não cabe dentro do elevador';
    elevatorDesc = `O comprimento do móvel (${maxDim} cm) excede a diagonal máxima interna do elevador (${Math.round(cabinDiagonal)} cm).`;
    elevatorTips.push('O transporte terá que ser feito por escadas ou içamento.');
  }

  // 4. STAIRS EVALUATION
  let stairsStatus: PassageStatus = 'pass';
  let stairsTitle = 'Passa pelas escadas';
  let stairsDesc = '';
  const stairsTips: string[] = [];

  if (minDim > path.stairs.stairWidth) {
    stairsStatus = 'blocked';
    stairsTitle = 'Escada muito estreita';
    stairsDesc = `A largura da escada (${path.stairs.stairWidth} cm) não comporta o móvel (${minDim} cm).`;
  } else if (path.stairs.hasTurn) {
    const landingW = path.stairs.landingWidth || path.stairs.stairWidth;
    const landingD = path.stairs.landingDepth || path.stairs.stairWidth;
    const landingDiagonal = Math.sqrt(Math.pow(landingW, 2) + Math.pow(landingD, 2));

    if (maxDim > landingDiagonal && maxDim > path.stairs.ceilingClearance) {
      stairsStatus = 'requires_onsite_inspection';
      stairsTitle = 'Atenção no patamar da escada';
      stairsDesc = `O patamar da curva da escada (${landingW} x ${landingD} cm) é restrito para o comprimento (${maxDim} cm).`;
      stairsTips.push('Verifique o corrimão: se for removível, libera até 10 cm extras de raio de giro.');
      stairsTips.push('Necessário equipe treinada com pelo menos 3 carregadores.');
    } else {
      stairsStatus = 'pass';
      stairsDesc = 'A escada e patamares possuem espaço suficiente para rotação e subida.';
    }
  } else {
    stairsStatus = 'pass';
    stairsDesc = 'Escada reta com largura adequada para transporte manual.';
  }

  // Overall Diagnosis
  const statuses = [doorStatus, hallwayStatus, elevatorStatus, stairsStatus];
  let overallStatus: PassageStatus = 'pass';
  let overallLabel = 'Caminho liberado com sucesso';
  let overallDescription = 'Todas as etapas verificadas (porta, corredor, elevador e escadas) são compatíveis com as medidas informadas.';

  if (statuses.includes('blocked')) {
    if (doorStatus === 'blocked' || hallwayStatus === 'blocked') {
      overallStatus = 'blocked';
      overallLabel = 'Caminho com bloqueio dimensional';
      overallDescription = 'Identificamos um ou mais pontos críticos intransponíveis com as medidas informadas.';
    } else if (elevatorStatus === 'blocked' && stairsStatus === 'pass') {
      overallStatus = 'pass_with_technique';
      overallLabel = 'Não cabe no elevador (passa pela escada)';
      overallDescription = 'O móvel não cabe na cabine do elevador, mas tem passagem viável pelas escadas do edifício.';
    } else {
      overallStatus = 'blocked';
      overallLabel = 'Acesso inviável sem desmontagem ou içamento';
      overallDescription = 'O móvel não cabe no elevador e apresenta restrições graves na escada/acesso.';
    }
  } else if (statuses.includes('requires_onsite_inspection')) {
    overallStatus = 'requires_onsite_inspection';
    overallLabel = 'Verificação presencial necessária';
    overallDescription = 'Existem curvas ou patamares estreitos que exigem medição in loco do raio de giro antes do frete.';
  } else if (statuses.includes('pass_with_technique')) {
    overallStatus = 'pass_with_technique';
    overallLabel = 'Passa com manobra ou rotação técnica';
    overallDescription = 'O trajeto é viável, porém exigirá manuseio específico (erguê-lo na vertical, inclinar na porta ou diagonal no elevador).';
  }

  return {
    overallStatus,
    overallLabel,
    overallDescription,
    doorDiagnosis: {
      passed: doorStatus !== 'blocked',
      status: doorStatus,
      statusLabel: doorTitle,
      title: 'Porta de Entrada',
      description: doorDesc,
      tips: doorTips,
      marginCm: doorMargin,
    },
    hallwayDiagnosis: {
      passed: hallwayStatus !== 'blocked',
      status: hallwayStatus,
      statusLabel: hallwayTitle,
      title: 'Corredores & Curvas',
      description: hallwayDesc,
      tips: hallwayTips,
      marginCm: hallMargin,
    },
    elevatorDiagnosis: {
      passed: elevatorStatus !== 'blocked',
      status: elevatorStatus,
      statusLabel: elevatorTitle,
      title: 'Elevador de Serviço / Social',
      description: elevatorDesc,
      tips: elevatorTips,
      marginCm: Math.round(path.elevator.cabinWidth - minDim),
    },
    stairsDiagnosis: {
      passed: stairsStatus !== 'blocked',
      status: stairsStatus,
      statusLabel: stairsTitle,
      title: 'Escadas & Patamares',
      description: stairsDesc,
      tips: stairsTips,
      marginCm: Math.round(path.stairs.stairWidth - minDim),
    },
    isPackagedEvaluated: evaluatePackaging && !!packagingDim && packagingDim.width > 0,
  };
}
