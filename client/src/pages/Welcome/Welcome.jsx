import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import styled from 'styled-components';
import { Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Editor } from '@monaco-editor/react';

import editorConfig from '~/config/editor';
import routesConfig from '~/config/routes';
import HexagonIcon from '~/components/HexagonIcon';
import useThemeStore from '~/stores/themeStore';
import LayoutFooter from '~/components/LayoutFooter';

const Container = styled.div.attrs({ className: 'dark:bg-gray-900 h-full relative overflow-y-auto overflow-x-hidden' })`
	&::-webkit-scrollbar {
		display: none;
	}
`;

const Welcome = () => {
	const { t } = useTranslation('welcome');
	const { theme, setMode } = useThemeStore();

	const pageRef = useRef();
	const ref1 = useRef();
	const ref2 = useRef();

	const codeExample = {
		c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
		cpp: `#include <bits/stdc++.h>
using namespace std;

int main(){
	cout<<"Hello, World!"<<endl;
	return 0;
}`,
		py: `print("Hello, World!")`,
	};

	return (
		<Container ref={pageRef}>
			<header
				className="fixed top-0 z-50 flex h-20 w-full items-center justify-between px-12 py-6 backdrop-blur-md"
				style={{
					maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)',
				}}
			>
				<Link to={routesConfig.welcome}>
					<img src="./logo.png" alt="" className="size-9" />
				</Link>
				<div>
					<button
						className="mx-6 text-sm font-semibold text-gray-900 transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
						onClick={() => pageRef.current.scrollTo({ top: 0, behavior: 'smooth' })}
					>
						{t('home')}
					</button>
					<button
						className="mx-6 text-sm font-semibold text-gray-900 transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
						onClick={() =>
							pageRef.current.scrollTo({
								top: ref1.current.offsetTop - 180,
								behavior: 'smooth',
							})
						}
					>
						{t('product')}
					</button>
					<button
						className="mx-6 text-sm font-semibold text-gray-900 transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
						onClick={() =>
							pageRef.current.scrollTo({
								top: ref2.current.offsetTop - 80,
								behavior: 'smooth',
							})
						}
					>
						{t('developer')}
					</button>
					<a
						className="mx-6 text-sm font-semibold text-gray-900 transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
						href="https://github.com/nourist"
					>
						{t('about-me')}
					</a>
				</div>
				<Link to={routesConfig.login} className="text-sm font-semibold text-gray-900 transition-all hover:text-sky-500 dark:text-gray-50 dark:hover:text-sky-500">
					{t('login')}
					<FontAwesomeIcon icon="fa-solid fa-arrow-right" className="mb-[-1px] ml-1" />
				</Link>
			</header>
			<div
				className="absolute inset-0 top-0 m-auto h-[357px] max-w-xs blur-[118px] sm:max-w-md md:max-w-lg"
				style={{
					background:
						'linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)',
				}}
			></div>
			<div className="relative mt-20 h-[90%] w-full space-y-10 py-36 text-center">
				<h1 className="mx-auto text-4xl font-extrabold text-gray-800 md:text-5xl dark:text-white">
					{(() => {
						const arr = t('slogan')
							.split(' ')
							.map((item) => ` ${item}`);
						arr[arr.length - 1] = (
							<span key={arr.length - 1} className="bg-gradient-to-r from-[#4F46E5] to-[#E114E5] bg-clip-text text-transparent">
								{arr[arr.length - 1]}
							</span>
						);
						return arr;
					})()}
				</h1>
				<p className="mx-auto max-w-2xl text-gray-500 dark:text-gray-400">{t('description')}</p>
				<div className="space-x-2">
					<Link to={routesConfig.signup} className="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-400">
						{t('get-started')}
					</Link>
					<a
						className="px-3.5 py-2.5 text-sm font-semibold transition-all hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
						href="https://github.com/nourist/Float-Point"
					>
						{t('learn-more')}
						<FontAwesomeIcon icon="fa-solid fa-arrow-right" className="mb-[-1px] ml-1" />
					</a>
				</div>
			</div>
			<div className="mb-[100px] flex flex-row flex-wrap justify-evenly gap-y-[100px]">
				<div className="mx-5 flex h-[300px] max-w-[540px] flex-col gap-6" ref={ref1}>
					<div className="flex flex-row space-x-[-12px]">
						<HexagonIcon className="z-20">
							<p className="text-xs font-bold text-sky-500">7749</p>
						</HexagonIcon>
						<HexagonIcon bg="linear-gradient(to bottom right, #cddc39 0%, #8bc34a 100%)" className="z-10">
							<FontAwesomeIcon className="text-lime-400" icon="fa-solid fa-users" />
						</HexagonIcon>
						<HexagonIcon bg="linear-gradient(to bottom right, #ffeb3b 0%, #fbc02d 100%)" className="z-0">
							<FontAwesomeIcon className="text-yellow-400" icon="fa-solid fa-trophy" />
						</HexagonIcon>
					</div>
					<h2 className="text-xl font-semibold text-sky-500">{t('product-title')}</h2>
					<p className="text-[15px] text-gray-400">{t('product-description')}</p>
					<Link to={routesConfig.problems} className="w-full text-[15px] text-sky-500 transition-all hover:text-sky-400">
						{t('view-questions')} <FontAwesomeIcon icon="fa-solid fa-angle-right" className="ml-1.5" />
					</Link>
				</div>

				<div className="mx-5 flex h-[300px] max-w-[540px] flex-col gap-6">
					<HexagonIcon bg="linear-gradient(to bottom right, rgb(155,155,155) 0%, rgb(44,44,44) 100%)" className="z-10">
						<FontAwesomeIcon icon="fa-solid fa-moon" className="size-5 text-slate-700 dark:text-zinc-500" />
					</HexagonIcon>
					<h2 className="text-xl font-semibold text-slate-700 dark:text-zinc-400">{t('appearance')}</h2>
					<p className="text-[15px] text-gray-400">{t('appearance-description')}</p>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								className={`size-8 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700`}
								onClick={() => setMode(theme == 'dark' ? 'light' : 'dark')}
							>
								{theme == 'dark' ? (
									<FontAwesomeIcon icon="fa-solid fa-moon" className="rotate-[-15deg] text-slate-400" />
								) : (
									<FontAwesomeIcon icon="fa-solid fa-sun" className="text-gray-600" />
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent className="bg-slate-500 dark:bg-gray-400">{t('try-now')}</TooltipContent>
					</Tooltip>
				</div>
			</div>
			<div className="mx-auto mb-8 flex max-w-[584px] flex-col items-center gap-6" ref={ref2}>
				<HexagonIcon bg="linear-gradient(to bottom right, #4db6ac 0%, #00796b 100%)">
					<FontAwesomeIcon icon="fa-solid fa-code" className="text-teal-500" />
				</HexagonIcon>
				<h2 className="text-xl font-semibold text-teal-500">{t('developer')}</h2>
				<p className="text-center text-[15px] text-gray-400">{t('developer-description')}</p>
			</div>
			<div className="h-[80vh] w-full px-44">
				<Tabs defaultValue="c" className="w-full">
					<TabsList className="w-full justify-start">
						<TabsTrigger value="c">C</TabsTrigger>
						<TabsTrigger value="cpp">C++</TabsTrigger>
						<TabsTrigger value="python">Python</TabsTrigger>
					</TabsList>
					<TabsContent className="h-[60vh] overflow-hidden rounded-md shadow-md" value="c">
						<Editor options={editorConfig} language="c" value={codeExample.c} theme={theme == 'dark' ? 'blackboard' : 'light'}></Editor>
					</TabsContent>
					<TabsContent className="h-[60vh] overflow-hidden rounded-md shadow-md" value="cpp">
						<Editor options={editorConfig} language="cpp" value={codeExample.cpp} theme={theme == 'dark' ? 'blackboard' : 'light'}></Editor>
					</TabsContent>
					<TabsContent className="h-[60vh] overflow-hidden rounded-md shadow-md" value="python">
						<Editor options={editorConfig} language="python" value={codeExample.py} theme={theme == 'dark' ? 'blackboard' : 'light'}></Editor>
					</TabsContent>
				</Tabs>
			</div>
			<LayoutFooter></LayoutFooter>
		</Container>
	);
};

export default Welcome;
