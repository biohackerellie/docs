import { useState } from 'react';

export function GenerateHex({ children }) {
	const genRanHex = (size) =>
		[...Array(size)]
			.map(() => Math.floor(Math.random() * 16).toString(16))
			.join('');
	const [hex, setHex] = useState('');
	return (
		<button onClick={() => setHex(genRanHex(32).toString())}>
			{children}
			{hex}
		</button>
	);
}
