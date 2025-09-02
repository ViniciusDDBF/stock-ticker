import rat from '../files/Google_AI_Studio_2025-08-27T19_36_48.854Z.png';
import ThemePicker from './ThemePicker';

const Header = () => {
  return (
    <header className="w-full bg-black-gradient relative py-12 flex flex-col justify-center items-center text-center">
      <div className="flex justify-center items-center">
        <h1 className="h1">Virtual</h1>
        <img src={rat} alt="Virtual Vini Logo" className="size-80 mb-4" />
        <h1 className="h1">Vini</h1>
      </div>
      <div className="flex flex-col justify-center">
        <p className="h2">Stock Predictions</p>
        <div className="flex flex-col justify-center">
          <ThemePicker />
        </div>
      </div>
    </header>
  );
};

export default Header;
