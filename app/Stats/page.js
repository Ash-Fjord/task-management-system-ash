"use client";
import Head from "next/head";
import Script from 'next/script';
import '../styles/Taskstyles.css';

export default function Home() {
  return (
    <>
    <Head>   
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
        <title>Stats</title>
    </Head>
    <div>
        <div>
        <p>Completed Tasks: <span id="completed-tasks-count">0</span></p>
        <p>Pending Tasks: <span id="pending-tasks-count">0</span></p>
        </div>
            <canvas id="task-priority-chart" width={400} height={200} />
    </div>
        <Script src="https://cdn.jsdelivr.net/npm/chart.js"></Script>
        <Script src="/Stats.js" strategy="lazyOnload"/>
    </>
  )
}