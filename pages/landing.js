import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
import LandingComponents from "../components/landing";
import Header from "../components/Header";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>TUPC Water Dispenser Refill Alert System</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Header />
      <LandingComponents />
    </div>
  );
}
