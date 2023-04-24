# React Terminal App

## A simple terminal website template made with React JS, Vite, and TailwindCSS with support for nested commands

[Demo](https://terminal.epklabs.com)

[Github](https://github.com/biohackerellie/react-terminal)

---

### Installation

To get started , clone the repo to your local machine then install the dependencies: 
```bash
cd react-terminal
npm install
```
To run a dev server on your local machine, run 
```bash
npm run dev
```
Now you can make changes and see them in real time. 

### Customize 
Right now, this site only has a couple of commands and they are specific to me, so I'll show you what files to change to make it your own. You can leave main, app, and index files alone unless you want to do further customization. 

#### Logo
In the `components` folder open the `header.jsx` file to replace my logo with your own. 

#### Customizing Commands
The `commands.jsx` component has been structured to set up multiple layers of commands. A simple command simply has a `type` and a `value`, and a command with more nested commands also has a `context` field, and require a seporate constant to be defined. For example:
```javascript
const commands ={
	help: () => ({
		type: "text", 
		value: 
			"Available commands: \b\n" + 
			"'websites' - view a list of Ellie's self developed websites \b\n" +
			"'hi' - say hello to Ellie \b\n" +
			"'clear' - clear the terminal \b\n" +
			"'socials' - view a list of Ellie's social media accounts \b\n" + 
			"'about' - learn more about Ellie \b\n" +
			"'contact' - send Ellie an email \b\n"
		}),
  websites: () => ({
		type: "text",
		value: "What website would you like to visit: \b\n" +
		"'portfolio' - Ellie's personal portfolio site \b\n" +
		"'docs' - Ellie's technical documentaiton \b\n",
		context: "websites",
	}),
}
const websiteCommands = {
	portfolio: () => ({ type: "link", value: "https://epklabs.com",}),
	docs: () => ({ type: "link", value: "https://docs.epklabs.com",}),
	
}

export default  commands;
export { websiteCommands }
```

#### Terminal component 
The `terminal.jsx` controls most of the logic for how the terminal outputs, so be careful when making changes here, and if something breaks, you can open an issue and I'll see if I can help. 

The main part you will ever need to change here other than styling, would be adding additional contexts, or command types. Contexts are used for creating nested commands so I will show you that in a sec, but with types, so far I've only added 2 types for this demo: text and link. Text outputs a simple text response, and links are coded to open a new tab to a listed url. Feel free to modify or add new types.

Below, I will show you a secion of the live code followed by a template for adding another context type: 
```javascript
/* note that this is pulled right from the middle of an if else statement, view the full terminal.jsx file to view it in context*/
              } else if (commandContext === 'websites' && websiteCommands.hasOwnProperty(input)) {
                const commandResult = websiteCommands[input]();
                if (commandResult.type === 'link') {
                  window.open(commandResult.value, '_blank', 'noopener,noreferrer');
                  newOutput += `Opened ${commandResult.value} in a new tab`;
                }
                setCommandContext(null);
              } 
              /*
               Here is where jump in 
               */
              
              else if (commandContext === 'new-context' && socialsCommands.hasOwnProperty(input)) {
                const commandResult = new-contextCommands[input]();
                if (commandResult.type === 'link') {
                  window.open(commandResult.value, '_blank', 'noopener,noreferrer');
                  newOutput += `Opened ${commandResult.value} in a new tab`;
                }
                setCommandContext(null);
              } else { /* rest of the code .....*/
```


### Deployment

While there are many services out there to host this app like GitHub Pages, Vercel, Firebase, etc. I have included a Dockerfile and the build script that I use to deploy this on my homelab. 

#### Dockerfile
```dockerfile
#Build step
FROM node:16 AS build
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . . 
RUN npm run build 

#Deploy step
FROM busybox:latest as deploy
WORKDIR /app
COPY --from=build /app/dist/ ./

EXPOSE 4020

CMD ["busybox", "httpd", "-f", "-v", "-p", "4020"]
```
