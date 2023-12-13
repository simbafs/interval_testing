import { useState } from 'react'
import './App.css'
import { useReducer } from 'react'
import { useEffect } from 'react'

function App() {
	const [interval, changeInterval] = useState(100)
	const [start, setStart] = useState(false)
	const [n, setN] = useState(0)
	const [history, updateHistory] = useReducer((state, action) => {
		if (action.clear) return []
		return [...state, action.data]
	}, [])
	const [analyzation, setAnalyzation] = useState(null)

	useEffect(() => {
		let i
		if (start)
			i = setInterval(() => {
				setN(n => n + 1)
				updateHistory({ data: Date.now() })
			}, interval)

		return () => {
			clearInterval(i)
		}
	}, [start, interval])

	useEffect(() => {
		function analyize(history) {
			const x = history
				.map((item, index) => history[index + 1] - item)
				.filter((_, index) => index !== history.length - 1)
			const X = x.reduce((a, b) => a + b, 0) / x.length
			const XX = x.reduce((a, b) => a + b * b, 0) / x.length

			return {
				avg: X,
				stdev: Math.sqrt(XX - X * X),
				len: history.length,
			}
		}

		setAnalyzation(analyize(history))
	}, [history])

	function clear() {
		setStart(false)
		setN(0)
		updateHistory({ clear: true })
	}

	return (
		<div>
			<input value={interval} onChange={e => changeInterval(e.target.value)} />
			<h1>n: {n}</h1>
			<button onClick={() => setStart(s => !s)}>{start ? 'Stop' : 'Start'}</button>
			<button onClick={clear}>Clear</button>
			<p>
				avg: {analyzation?.avg.toFixed(2)} ms, stdev: {analyzation?.stdev.toFixed(2)} ms (
				{(analyzation?.stdev / analyzation?.avg).toFixed(2)})
			</p>
			<ul>
				{history.map((time, index) => (
					<li key={index}>{time}</li>
				))}
			</ul>
		</div>
	)
}

export default App
