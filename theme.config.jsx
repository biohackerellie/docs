import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const config = {
	project: {
		link: 'https://github.com/biohackerellie/docs',
	},
	chat: {
		link: 'https://twitter.com/biohacker_ellie',
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 1200 1227'
			>
				<path
					d='M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	logo: <strong>EPKLabs Documentation</strong>,
	docsRepositoryBase: 'https://github.com/biohackerellie/docs/tree/main',
	primaryHue: 201,
	darkMode: true,
	logo: (
		<>
			<Image
				src='/logo.png'
				alt='EPKLabs Logo'
				width={50}
				height={50}
			/>
			<span style={{ marginLeft: '.4em', fontWeight: 800 }}>
				{' '}
				Ellie's Documentation{' '}
			</span>
		</>
	),
	useNextSeoProps() {
		return {
			titleTemplate: '%s - EPKLabs Docs',
		};
	},
	footer: {
		text: (
			<span>
				MIT {new Date().getFullYear()} ©{' '}
				<a
					href='https://epklabs.com'
					target='_blank'
				>
					Ellie Kerns
				</a>
			</span>
		),
	},
};

export default config;
