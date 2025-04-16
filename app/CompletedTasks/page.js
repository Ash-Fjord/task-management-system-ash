"use client";
import Head from "next/head";
import Script from 'next/script';
import '../styles/Taskstyles.css';

export default function CompletedTasks() {
    return (
      <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Completed Tasks</title>
        </Head>
    <div>
  <header>
    <h1>Completed Tasks</h1>
  </header>
  <ul id="completed-tasks-list" />
    </div>
    <Script src="/CompletedTasks.js" strategy="lazyOnload"/>
      </>
    )
}