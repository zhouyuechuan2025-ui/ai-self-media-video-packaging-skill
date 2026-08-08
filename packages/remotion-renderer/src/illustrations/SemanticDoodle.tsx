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
        <path d="M52 320 C145 293 228 258 306 218 C396 170 476 116 588 58" strokeDasharray="680" strokeDashoffset={680 * (1 - draw)}/>
        <g data-doodle-object="climber" transform={`translate(${Math.round(move * 22)} ${Math.round(-move * 14)})`}>
          <circle cx="184" cy="198" r="19"/>
          <path d="M186 218 L209 258 M199 237 L246 215 M207 257 L176 294 M208 257 L247 281"/>
          <path d="M233 215 L270 203"/>
        </g>
        <g data-doodle-object="boulder" transform={`translate(${Math.round(move * 42)} ${Math.round(-move * 28)})`}>
          <circle cx="318" cy="184" r="54" fill={`${accent}18`}/>
          <path d="M287 164 C309 141 347 148 359 179 C368 207 346 237 315 238 C285 239 264 211 269 185"/>
        </g>
      </g>
      <g data-doodle-layer="action" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${Math.round(move * 38)} 0)`}>
        <path d="M354 159 C410 132 458 104 510 73" strokeDasharray="210" strokeDashoffset={210 * (1 - move)}/>
        <path d="M480 70 L514 70 L500 101" opacity={move}/>
        <path d="M250 214 L279 198" opacity={move}/>
      </g>
      <g data-doodle-layer="outcome" fill="none" stroke="#252933" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={finish} transform={`scale(${.86 + finish * .14})`} style={{transformOrigin: '548px 68px'}}>
        <path d="M548 103 V32 M548 34 H606 L584 57 L606 80 H548"/>
        <circle cx="548" cy="104" r="8" fill={accent} stroke={accent}/>
        <path d="M505 128 C529 115 553 105 576 96" stroke={accent} strokeWidth="9"/>
      </g>
    </svg>
  );
};
