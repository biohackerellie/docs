import { FileTree } from 'nextra/components';

const AppTree = () => {
	return (
		<FileTree>
			<FileTree.Folder
				name='src'
				defaultOpen
			>
				<FileTree.Folder
					name='app'
					defaultOpen
				>
					<FileTree.Folder
						name='(authenticated)'
						defaultOpen
					>
						<FileTree.Folder name='Account' />
						<FileTree.Folder name='Admin' />
						...
					</FileTree.Folder>
					<FileTree.Folder
						name='api'
						defaultOpen
					>
						<FileTree.Folder
							name='facilities'
							defaultOpen
						>
							<FileTree.File name='route.ts' />
							...
						</FileTree.Folder>
					</FileTree.Folder>
					<FileTree.Folder
						name='facilities'
						defaultOpen
					>
						<FileTree.Folder
							name='[id]'
							defaultOpen
						>
							<FileTree.File name='page.tsx' />
						</FileTree.Folder>
						<FileTree.File name='page.tsx' />
						<FileTree.File name='layout.tsx' />
					</FileTree.Folder>
					...
					<FileTree.File name='page.tsx' />
					<FileTree.File name='layout.tsx' />
				</FileTree.Folder>
				<FileTree.Folder name='components' />
				<FileTree.Folder name='functions' />
				<FileTree.Folder name='lib' />
				<FileTree.Folder name='utils' />
				<FileTree.File name='middleware.ts' />
			</FileTree.Folder>
		</FileTree>
	);
};

export default AppTree;
