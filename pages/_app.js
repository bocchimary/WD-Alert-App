import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import '../styles/styles.css';

import { useEffect } from "react";
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, []);

  return <Component {...pageProps} />
}

export default MyApp;
