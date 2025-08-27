import { useDispatch, useSelector } from 'react-redux';
import { abrir, fechar } from './store/slices/modal';
import { incrementar, reduzir } from './store/slices/counter';
import type { RootState } from './types';

const App = () => {
  const modal = useSelector((state: RootState) => state.modal);
  const counter = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      {modal && <h1>{counter}</h1>}
      <div>
        <h1 className="bg-black text-orange-400">VINI</h1>
        <button
          className="bg-amber-500 border-2 p-2 rounded-2xl"
          onClick={() => dispatch(abrir())}
        >
          ABRIR
        </button>
        <button onClick={() => dispatch(fechar())}>FECHAR</button>
      </div>
      <div>
        <button onClick={() => dispatch(incrementar())}>
          {'incrementar'.toLocaleUpperCase()}
        </button>
        <button onClick={() => dispatch(reduzir())}>
          {'reduzir'.toLocaleUpperCase()}
        </button>
      </div>
    </div>
  );
};
export default App;
