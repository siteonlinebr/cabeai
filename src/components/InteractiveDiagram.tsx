import React from 'react';
import { Dimensions, FitCalculationResult, ProductCategory } from '../types';
import { RotateCw, Maximize2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface InteractiveDiagramProps {
  productDim: Dimensions;
  spaceDim: Dimensions;
  fitResult: FitCalculationResult;
  category: ProductCategory;
  productName: string;
  isRotated: boolean;
  onToggleRotation: () => void;
  viewMode?: 'top' | 'front';
  onChangeViewMode?: (mode: 'top' | 'front') => void;
}

export const InteractiveDiagram: React.FC<InteractiveDiagramProps> = ({
  productDim,
  spaceDim,
  fitResult,
  category,
  productName,
  isRotated,
  onToggleRotation,
  viewMode = 'top',
  onChangeViewMode,
}) => {
  // Proportional drawing math inside a clean SVG viewBox (e.g. 520 x 320)
  const svgWidth = 520;
  const svgHeight = 280;
  const marginX = 65;
  const marginY = 45;
  const drawAreaW = svgWidth - marginX * 2;
  const drawAreaH = svgHeight - marginY * 2;

  // Active product footprint
  const itemW = isRotated ? productDim.depth : productDim.width;
  const itemD = isRotated ? productDim.width : productDim.depth;
  const itemH = productDim.height;

  const roomW = Math.max(spaceDim.width, 100);
  const roomD = Math.max(spaceDim.depth, 100);
  const roomH = Math.max(spaceDim.height || 260, 200);

  // Scale factor to fit room in SVG
  const isTopView = viewMode === 'top';
  const activeRoomWidth = isTopView ? roomW : roomW;
  const activeRoomHeight = isTopView ? roomD : roomH;
  const activeItemWidth = isTopView ? itemW : itemW;
  const activeItemHeight = isTopView ? itemD : itemH;

  const scale = Math.min(
    drawAreaW / (activeRoomWidth * 1.15),
    drawAreaH / (activeRoomHeight * 1.15)
  );

  // Scaled dimensions
  const sRoomW = activeRoomWidth * scale;
  const sRoomH = activeRoomHeight * scale;
  const sItemW = activeItemWidth * scale;
  const sItemH = activeItemHeight * scale;

  // Center room in draw area
  const roomX = marginX + (drawAreaW - sRoomW) / 2;
  const roomY = marginY + (drawAreaH - sRoomH) / 2;

  // Center item along bottom wall or center
  // In residential layouts, sofa/credenza usually touches back wall:
  const itemX = roomX + 16; // 16px offset from left or centered
  const itemY = roomY + (sRoomH - sItemH) / 2; // centered in depth

  // Clearance calculation
  const remainingW = activeRoomWidth - activeItemWidth;
  const clearanceSvgX = itemX + sItemW;
  const clearanceSvgW = Math.max(0, (roomX + sRoomW) - clearanceSvgX - 10);

  const isOverflow = remainingW < 0;
  const isTight = remainingW >= 0 && remainingW < 15;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-[#E1E3DB] shadow-xs overflow-hidden">
      {/* Top Diagram Header with View Mode and Rotation */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#FAF8F3] border-b border-[#E1E3DB]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#172A2B] uppercase tracking-wider font-sora">
            {isTopView ? 'Planta Baixa (Vista Superior)' : 'Elevação Frontal (Altura & Teto)'}
          </span>
          <span className="text-[11px] text-[#65716F]">
            {isRotated ? '• Rotação 90° Ativa' : '• Posição Padrão'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onChangeViewMode && (
            <button
              type="button"
              onClick={() => onChangeViewMode(isTopView ? 'front' : 'top')}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md text-[#347F6C] hover:bg-[#E5F0E8] transition-colors font-medium border border-[#347F6C]/20"
              title="Alternar entre planta baixa e vista frontal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              {isTopView ? 'Ver Altura' : 'Ver Planta'}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleRotation}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all font-medium border ${
              isRotated
                ? 'bg-[#347F6C] text-white border-[#347F6C]'
                : 'bg-white text-[#172A2B] border-[#E1E3DB] hover:border-[#347F6C]'
            }`}
            title="Girar o móvel em 90 graus"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotated ? 'rotate-90' : ''} transition-transform`} />
            Girar 90°
          </button>
        </div>
      </div>

      {/* Main SVG Render Area */}
      <div className="relative p-2 bg-[#FBF9F5] flex items-center justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[540px] h-auto drop-shadow-xs select-none"
          style={{ minHeight: '230px' }}
        >
          <defs>
            {/* Architectural patterns */}
            <pattern id="woodFloor" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0,10 L 20,10 M 10,0 L 10,20" fill="none" stroke="#E6E0D2" strokeWidth="0.6" />
            </pattern>
            <pattern id="diagonalHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="4" height="8" fill="#F87171" opacity="0.3" />
            </pattern>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#172A2B" />
            </marker>
            <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#347F6C" />
            </marker>
            <marker id="arrowOrange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F47736" />
            </marker>
          </defs>

          {/* ROOM BOUNDING RECTANGLE (FLOOR PLAN) */}
          <g>
            {/* Room Floor */}
            <rect
              x={roomX}
              y={roomY}
              width={sRoomW}
              height={sRoomH}
              fill="url(#woodFloor)"
              stroke="#2E3836"
              strokeWidth="3.5"
              rx="4"
            />

            {/* Inner Wall Shadow */}
            <rect
              x={roomX + 2}
              y={roomY + 2}
              width={sRoomW - 4}
              height={sRoomH - 4}
              fill="#FAF7EE"
              fillOpacity="0.85"
            />

            {/* Decorative Architectural details in Top View (Door swing, plant, rug) */}
            {isTopView && (
              <g opacity="0.85">
                {/* Door Opening swing in the corner */}
                <path
                  d={`M ${roomX + sRoomW - 35} ${roomY} A 35 35 0 0 1 ${roomX + sRoomW} ${roomY + 35}`}
                  fill="none"
                  stroke="#8B9896"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <line
                  x1={roomX + sRoomW - 35}
                  y1={roomY}
                  x2={roomX + sRoomW}
                  y2={roomY}
                  stroke="#347F6C"
                  strokeWidth="2.5"
                />

                {/* Decorative Rug under sofa area */}
                <rect
                  x={itemX - 8}
                  y={itemY - 6}
                  width={sItemW + 16}
                  height={sItemH + 14}
                  fill="#EFE9DC"
                  stroke="#D8CFBD"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  rx="3"
                />

                {/* Mini decorative potted plant in top-left */}
                <circle cx={roomX + 16} cy={roomY + 16} r="8" fill="#4A9A7C" opacity="0.4" />
                <circle cx={roomX + 16} cy={roomY + 16} r="4" fill="#347F6C" />
              </g>
            )}

            {/* If Front View: show ceiling line and floor baseboard */}
            {!isTopView && (
              <g>
                {/* Ceiling bar */}
                <line
                  x1={roomX}
                  y1={roomY}
                  x2={roomX + sRoomW}
                  y2={roomY}
                  stroke="#475569"
                  strokeWidth="4"
                />
                {/* Floor line */}
                <line
                  x1={roomX}
                  y1={roomY + sRoomH}
                  x2={roomX + sRoomW}
                  y2={roomY + sRoomH}
                  stroke="#78350F"
                  strokeWidth="4"
                />
              </g>
            )}
          </g>

          {/* FURNITURE ITEM (SVG TOP OR FRONT VIEW) */}
          <g>
            {/* If item overflows, render red overflow danger hatch */}
            {isOverflow && (
              <rect
                x={itemX + sRoomW - 16}
                y={itemY}
                width={Math.min(sItemW - (sRoomW - 16), 40)}
                height={sItemH}
                fill="url(#diagonalHatch)"
                stroke="#DC2626"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* Furniture main body */}
            <rect
              x={itemX}
              y={itemY}
              width={sItemW}
              height={sItemH}
              fill={isOverflow ? '#FEE2E2' : '#ECE5D8'}
              stroke={isOverflow ? '#DC2626' : '#6A6150'}
              strokeWidth="2"
              rx="4"
              className="transition-all duration-300"
            />

            {/* Realistic category styling details (Sofa cushions, fridge door split, bed pillows) */}
            {isTopView ? (
              <g>
                {category === 'sofas' && (
                  <>
                    {/* Backrest */}
                    <rect
                      x={itemX + 4}
                      y={itemY + 3}
                      width={sItemW - 8}
                      height={Math.max(6, sItemH * 0.28)}
                      fill="#D8CEBE"
                      rx="2"
                    />
                    {/* Left & Right Armrests */}
                    <rect x={itemX + 2} y={itemY + 2} width={Math.max(6, sItemW * 0.1)} height={sItemH - 4} fill="#C6BBA8" rx="2" />
                    <rect x={itemX + sItemW - Math.max(6, sItemW * 0.1) - 2} y={itemY + 2} width={Math.max(6, sItemW * 0.1)} height={sItemH - 4} fill="#C6BBA8" rx="2" />
                    {/* Seat division line */}
                    <line x1={itemX + sItemW / 2} y1={itemY + sItemH * 0.3} x2={itemX + sItemW / 2} y2={itemY + sItemH - 4} stroke="#B3A591" strokeWidth="1.2" strokeDasharray="2 1" />
                  </>
                )}
                {category === 'geladeiras' && (
                  <>
                    {/* Fridge front handle edge */}
                    <line x1={itemX + 4} y1={itemY + sItemH - 3} x2={itemX + sItemW - 4} y2={itemY + sItemH - 3} stroke="#64748B" strokeWidth="2.5" />
                    <rect x={itemX + sItemW * 0.2} y={itemY + sItemH - 5} width={sItemW * 0.6} height="3" fill="#334155" rx="1" />
                  </>
                )}
                {category === 'camas' && (
                  <>
                    {/* Pillows */}
                    <rect x={itemX + 6} y={itemY + 5} width={sItemW * 0.4} height={sItemH * 0.22} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" rx="2" />
                    <rect x={itemX + sItemW * 0.54} y={itemY + 5} width={sItemW * 0.4} height={sItemH * 0.22} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" rx="2" />
                    {/* Blanket fold */}
                    <line x1={itemX + 4} y1={itemY + sItemH * 0.45} x2={itemX + sItemW - 4} y2={itemY + sItemH * 0.45} stroke="#CBD5E1" strokeWidth="1.5" />
                  </>
                )}
              </g>
            ) : (
              // Front elevation view
              <g>
                {/* Height visual division */}
                <line x1={itemX + 6} y1={itemY + sItemH * 0.4} x2={itemX + sItemW - 6} y2={itemY + sItemH * 0.4} stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
              </g>
            )}

            {/* Centered Furniture Dimension Tag */}
            <g transform={`translate(${itemX + sItemW / 2}, ${itemY + sItemH / 2})`}>
              <rect
                x="-36"
                y="-11"
                width="72"
                height="22"
                fill="#172A2B"
                rx="11"
                className="drop-shadow-xs"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
              >
                {Math.round(activeItemWidth)} cm
              </text>
            </g>
          </g>

          {/* DYNAMIC CLEARANCE CALLOUT (GREEN OR ORANGE CALLOUT ARROW) */}
          {!isOverflow && clearanceSvgW > 12 && (
            <g>
              {/* Clearance line */}
              <line
                x1={clearanceSvgX + 4}
                y1={itemY + sItemH / 2}
                x2={roomX + sRoomW - 4}
                y2={itemY + sItemH / 2}
                stroke={isTight ? '#F47736' : '#347F6C'}
                strokeWidth="2"
                strokeDasharray="3 2"
              />

              {/* Clearance tag */}
              <g transform={`translate(${clearanceSvgX + clearanceSvgW / 2 + 2}, ${itemY + sItemH / 2})`}>
                <rect
                  x="-28"
                  y="-10"
                  width="56"
                  height="20"
                  fill={isTight ? '#FFF7ED' : '#E5F0E8'}
                  stroke={isTight ? '#F47736' : '#347F6C'}
                  strokeWidth="1.2"
                  rx="6"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={isTight ? '#C2410C' : '#235D4F'}
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {Math.round(remainingW)} cm
                </text>
              </g>
            </g>
          )}

          {/* EXTERNAL ROOM MEASUREMENT LABELS & ARROWS (Exactly like Mockup!) */}
          {/* Horizontal Dimension Arrow (Bottom of Room) */}
          <g>
            <line
              x1={roomX}
              y1={roomY + sRoomH + 20}
              x2={roomX + sRoomW}
              y2={roomY + sRoomH + 20}
              stroke="#172A2B"
              strokeWidth="1.5"
              markerStart="url(#arrow)"
              markerEnd="url(#arrow)"
            />
            {/* Tick ends */}
            <line x1={roomX} y1={roomY + sRoomH + 12} x2={roomX} y2={roomY + sRoomH + 28} stroke="#172A2B" strokeWidth="1.5" />
            <line x1={roomX + sRoomW} y1={roomY + sRoomH + 12} x2={roomX + sRoomW} y2={roomY + sRoomH + 28} stroke="#172A2B" strokeWidth="1.5" />

            <rect
              x={roomX + sRoomW / 2 - 32}
              y={roomY + sRoomH + 11}
              width="64"
              height="18"
              fill="#FBF9F5"
              rx="4"
            />
            <text
              x={roomX + sRoomW / 2}
              y={roomY + sRoomH + 24}
              textAnchor="middle"
              fill="#172A2B"
              fontSize="12"
              fontWeight="700"
              fontFamily="Sora, sans-serif"
            >
              {Math.round(activeRoomWidth)} cm
            </text>
          </g>

          {/* Vertical Dimension Arrow (Left of Room) */}
          <g>
            <line
              x1={roomX - 22}
              y1={roomY}
              x2={roomX - 22}
              y2={roomY + sRoomH}
              stroke="#172A2B"
              strokeWidth="1.5"
              markerStart="url(#arrow)"
              markerEnd="url(#arrow)"
            />
            {/* Tick ends */}
            <line x1={roomX - 30} y1={roomY} x2={roomX - 14} y2={roomY} stroke="#172A2B" strokeWidth="1.5" />
            <line x1={roomX - 30} y1={roomY + sRoomH} x2={roomX - 14} y2={roomY + sRoomH} stroke="#172A2B" strokeWidth="1.5" />

            <rect
              x={roomX - 44}
              y={roomY + sRoomH / 2 - 10}
              width="44"
              height="20"
              fill="#FBF9F5"
              rx="4"
            />
            <text
              x={roomX - 22}
              y={roomY + sRoomH / 2 + 4}
              textAnchor="middle"
              fill="#172A2B"
              fontSize="11"
              fontWeight="700"
              fontFamily="Sora, sans-serif"
            >
              {Math.round(activeRoomHeight)} cm
            </text>
          </g>
        </svg>
      </div>

      {/* Diagram Footer with Summary & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-white border-t border-[#E1E3DB] text-xs text-[#65716F]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ECE5D8] border border-[#6A6150]" />
            Móvel ({productName || 'Produto'}): {Math.round(itemW)} × {Math.round(itemD)} cm
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FAF7EE] border border-[#2E3836]" />
            Espaço: {Math.round(roomW)} × {Math.round(roomD)} cm
          </span>
        </div>

        <div className="flex items-center gap-2">
          {fitResult.status === 'fits' ? (
            <span className="inline-flex items-center gap-1 text-[#347F6C] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Folga lateral: {Math.round(fitResult.lateralClearance)} cm
            </span>
          ) : fitResult.status === 'fits_with_restrictions' ? (
            <span className="inline-flex items-center gap-1 text-[#F47736] font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Espaço estreito: {Math.round(fitResult.lateralClearance)} cm
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[#DC2626] font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Excede em {Math.abs(Math.round(fitResult.lateralClearance))} cm
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
