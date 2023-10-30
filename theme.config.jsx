import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const config = {
	project: {
		link: 'https://github.com/biohackerellie/docs',
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
