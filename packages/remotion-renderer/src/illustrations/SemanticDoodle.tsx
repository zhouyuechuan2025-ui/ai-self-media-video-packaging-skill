import type {ReactElement} from 'react';
import {phase} from '../structures/shared';
import type {IllustrationProps} from './types';

export const SemanticDoodle = ({progress, accent, subject, action, outcome}: IllustrationProps): ReactElement => {
  const draw = phase(progress, 0.08, 0.66);
  const move = phase(progress, 0.22, 0.82);
  const finish = phase(progress, 0.58, 1);
  return (
    <svg viewBox="0 0 640 360" fill="none" style={{width: '100%', height: '100%', overflow: 'visible'}} aria-label={`${subject ?? 'subject'} ${action ?? 'action'} ${outcome ?? 'outcome'}`}>
      <g data-doodle-layer="line" stroke="#252933" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.12 + draw * .88}>
        <circle cx="132" cy="115" r="34"/>
        <path d="M130 150c-8 45-5 83 12 112M142 183l58 24M142 183l-48 50M142 262l-42 61M142 262l53 58"/>
        <path d="M214 210h210l45-60h76" strokeDasharray="420" strokeDashoffset={420 * (1 - draw)}/>
      </g>
      <g data-doodle-layer="action" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${Math.round(move * 38)} 0)`}>
        <path d="M218 208h182" strokeDasharray="182" strokeDashoffset={182 * (1 - move)}/>
        <path d="m374 180 31 28-31 29" opacity={move}/>
        <circle cx="284" cy="208" r="18" fill={accent} opacity={move}/>
      </g>
      <g data-doodle-layer="outcome" fill="none" stroke="#252933" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={finish} transform={`scale(${.86 + finish * .14})`} style={{transformOrigin: '520px 150px'}}>
        <rect x="472" y="103" width="96" height="96" rx="24" fill={`${accent}22`}/>
        <path d="m493 151 19 20 38-44" stroke={accent} strokeWidth="12"/>
        <path d="M485 230h76M501 252h44"/>
      </g>
    </svg>
  );
};

