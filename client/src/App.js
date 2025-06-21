import logo from './logo.svg';
import './App.css';

function App() {
  return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>

			<div className="min-h-screen bg-blue-600 text-white flex items-center justify-center">
				<h1 className="text-4xl font-bold">Tailwind CSS is Working!</h1>
			</div>
      
		</div>
  );
}

export default App;
