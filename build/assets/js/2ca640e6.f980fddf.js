"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[651],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>g});var o=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=o.createContext({}),c=function(e){var t=o.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return o.createElement(l.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},f=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(r),f=n,g=p["".concat(l,".").concat(f)]||p[f]||d[f]||a;return r?o.createElement(g,i(i({ref:t},u),{},{components:r})):o.createElement(g,i({ref:t},u))}));function g(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,i=new Array(a);i[0]=f;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:n,i[1]=s;for(var c=2;c<a;c++)i[c]=r[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,r)}f.displayName="MDXCreateElement"},9310:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var o=r(7462),n=(r(7294),r(3905));const a={},i=void 0,s={unversionedId:"Work Projects/Windows RDS server",id:"Work Projects/Windows RDS server",title:"Windows RDS server",description:"This is an ongoing project for Laurel Public Schools and I will be updating the documentation as we go.",source:"@site/docs/Work Projects/Windows RDS server.md",sourceDirName:"Work Projects",slug:"/Work Projects/Windows RDS server",permalink:"/docs/Work Projects/Windows RDS server",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Work Projects",permalink:"/docs/category/work-projects"}},l={},c=[{value:"Project Goal",id:"project-goal",level:2},{value:"Progress",id:"progress",level:2},{value:"Initial Stages",id:"initial-stages",level:3}],u={toc:c};function p(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,o.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"This is an ongoing project for Laurel Public Schools and I will be updating the documentation as we go. "),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"project-goal"},"Project Goal"),(0,n.kt)("p",null,"The goal with this project is to build a scalable RDS server for students to be able to remote into from their chromebooks, allowing us to cut down on computer labs\noutside of the classes that use Photoshop and Illustrator."),(0,n.kt)("hr",null),(0,n.kt)("h2",{id:"progress"},"Progress"),(0,n.kt)("h3",{id:"initial-stages"},"Initial Stages"),(0,n.kt)("p",null,"Currently, we are building all on prem, testing with 3 windows server vms, 1 to run the gateway and licensing, the connection broker, and the session host. Once we have a proof of concept and the plan gets approved, the hope is to integrate a kubernetese cluster to scale this out."))}p.isMDXComponent=!0}}]);