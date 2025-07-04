import './styles.css';
import logo from '../assets/logo_1.png'

export const LoadingPage = () => {

  return (<>
    <div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="bg bg3"></div>
    <div className="content">
      <img src={logo}></img>
    </div>
  </>
  );
};