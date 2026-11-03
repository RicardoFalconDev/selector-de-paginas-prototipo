import { asset } from '../asset.js';

/** "Toggle / Checkmark" del sistema: cuadrado 20px, radio 6px. */
export default function Checkbox({ checked, onChange, id, labelledBy }) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      className={`checkbox${checked ? ' checkbox--checked' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="checkbox__box">{checked && <img src={asset('check.svg')} alt="" />}</span>
    </button>
  );
}
