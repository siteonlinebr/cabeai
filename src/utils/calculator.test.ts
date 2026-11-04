import { calculateSpaceFit, calculateDeliveryPath } from './calculator';
import { DEFAULT_DELIVERY_PATH } from '../data/categories';

export function runCalculationTests(): { name: string; passed: boolean; details: string }[] {
  const tests: { name: string; passed: boolean; details: string }[] = [];

  // Test 1: Fits comfortably (Mockup sofa scenario: 210cm in 230cm space -> 20cm lateral clearance)
  {
    const res = calculateSpaceFit(
      { width: 210, height: 92, depth: 95 },
      { width: 230, height: 260, depth: 110 }
    );
    const pass = res.status === 'fits' && res.lateralClearance === 20 && res.depthClearance === 15;
    tests.push({
      name: 'Sofá de 210cm em espaço de 230cm',
      passed: pass,
      details: `Status: ${res.status}, Folga lateral: ${res.lateralClearance}cm (esperado: 20cm)`,
    });
  }

  // Test 2: Incompatible dimensions (width 250cm in 220cm space)
  {
    const res = calculateSpaceFit(
      { width: 250, height: 90, depth: 90 },
      { width: 220, height: 260, depth: 100 }
    );
    const pass = res.status === 'does_not_fit' && res.lateralClearance < 0;
    tests.push({
      name: 'Móvel que excede largura (250cm em 220cm)',
      passed: pass,
      details: `Status: ${res.status}, Folga lateral: ${res.lateralClearance}cm (esperado: <0)`,
    });
  }

  // Test 3: Rotation solves fit (Width 150, Depth 80 in space 100x160)
  {
    // Standard: 150 > 100 (does not fit)
    const standard = calculateSpaceFit(
      { width: 150, height: 80, depth: 80 },
      { width: 100, height: 260, depth: 160 },
      undefined,
      false
    );
    // Rotated 90°: footprint becomes width 80, depth 150 -> fits into 100x160!
    const rotated = calculateSpaceFit(
      { width: 150, height: 80, depth: 80 },
      { width: 100, height: 260, depth: 160 },
      undefined,
      true
    );
    const pass = standard.status === 'does_not_fit' && standard.canRotateToFit && rotated.status === 'fits';
    tests.push({
      name: 'Verificação de rotação inteligente 90°',
      passed: pass,
      details: `Padrão: ${standard.status} (pode rotacionar: ${standard.canRotateToFit}), Rotacionado: ${rotated.status}`,
    });
  }

  // Test 4: Appliance ventilation clearance triggers 'fits_with_restrictions'
  {
    const res = calculateSpaceFit(
      { width: 70, height: 180, depth: 70 },
      { width: 75, height: 200, depth: 80 },
      { minSideClearance: 0, circulationSpace: 0, ventilationClearance: 10 } // requires 10cm each side -> total 90cm required
    );
    const pass = res.status === 'fits_with_restrictions';
    tests.push({
      name: 'Restrição de ventilação de fabricante para geladeira',
      passed: pass,
      details: `Status: ${res.status} (esperado: fits_with_restrictions devido a folga de calor insuficiente)`,
    });
  }

  // Test 5: Delivery path doorway clearance
  {
    // Standard sofa 210 x 92 x 95 through 80cm door:
    // minDim is 92 or 95 which is > 80cm without tilt or standing upright,
    // but with 210cm height door, it can pass with technique (diagonal or feet removed)
    const diagnosis = calculateDeliveryPath(
      { width: 210, height: 92, depth: 95 },
      undefined,
      DEFAULT_DELIVERY_PATH,
      false
    );
    const pass = diagnosis.doorDiagnosis.status === 'pass_with_technique' || diagnosis.doorDiagnosis.status === 'blocked';
    tests.push({
      name: 'Diagnóstico de passagem pela porta',
      passed: pass,
      details: `Porta: ${diagnosis.doorDiagnosis.statusLabel} - ${diagnosis.doorDiagnosis.description}`,
    });
  }

  // Test 6: Narrow doorway hard block (Packaged item smallest side is 90cm, door is 70cm)
  {
    const pathCustom = {
      ...DEFAULT_DELIVERY_PATH,
      door: { width: 70, height: 210, openingAngle: 90, removeDoorTrim: false },
    };
    const diagnosis = calculateDeliveryPath(
      { width: 95, height: 90, depth: 100 },
      undefined,
      pathCustom,
      false
    );
    const pass = diagnosis.doorDiagnosis.status === 'blocked';
    tests.push({
      name: 'Bloqueio dimensional em porta estreita (70cm)',
      passed: pass,
      details: `Status porta: ${diagnosis.doorDiagnosis.status} (esperado: blocked)`,
    });
  }

  return tests;
}
