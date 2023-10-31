/** @type {import('next').NextConfig} */
const withNextra = require('nextra')({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.jsx',
});

(module.exports = withNextra()),
	{
		pageExtensions: ['mdx', 'md', 'jsx', 'js', 'ts', 'tsx'],

		reactStrictMode: false,
	};
