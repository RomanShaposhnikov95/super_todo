import './App.css';
import {Input} from "./components/Input/Input";
import {Lists} from "./components/Lists/Lists";
import {Filters} from "./components/Filters/Filters";

function App() {
  return (
    <div className="App">
        <Input/>
        <Lists/>
        <Filters/>
    </div>
  );
}

export default App;
