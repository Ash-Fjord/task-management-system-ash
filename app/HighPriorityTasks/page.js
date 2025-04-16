"use client";
import Head from "next/head";
import Script from 'next/script';
import '../styles/Taskstyles.css';

export default function HighPriorityTasks() {
    return (
      <>
      <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>High Priority Tasks</title>
        </Head>
    <div>
        <header>
            <h1>High Priority Tasks</h1>
        </header>
        <ul id="high-priority-tasks" />
        </div>
            <Script src="/HighPriorityTasks.js" strategy="lazyOnload"/>
      </>
    )
}
