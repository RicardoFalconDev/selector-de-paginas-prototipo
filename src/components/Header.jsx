import { asset } from '../asset.js';

/** Barra superior del flujo "Configurar firma". */
export default function Header() {
  return (
    <header className="header">
      <div className="fid-logo" role="img" aria-label="FID by Lakaut">
        <span className="fid-logo__top"><img src={asset('logo-1.svg')} alt="" /></span>
        <span className="fid-logo__by"><img src={asset('logo-2.svg')} alt="" /></span>
        <span className="fid-logo__lakaut"><img src={asset('logo-3.svg')} alt="" /></span>
      </div>
      <button className="icon-btn" type="button" aria-label="Volver">
        <img src={asset('arrow-back.svg')} alt="" />
      </button>
      <h1 className="header__title">Configurar firma</h1>
      <div className="header__actions">
        <button className="btn btn--primary btn--sm" type="button">
          Continuar
        </button>
        <button className="icon-btn" type="button" aria-label="Cerrar">
          <img src={asset('close.svg')} alt="" />
        </button>
      </div>
    </header>
  );
}
