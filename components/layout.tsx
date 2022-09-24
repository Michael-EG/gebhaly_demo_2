import {
    AppBar,
    Badge,
    Button,
    Container,
    createTheme,
    CssBaseline,
    Link,
    Menu,
    MenuItem,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography,
  } from '@mui/material';
  import Head from 'next/head';
  import NextLink from 'next/link';
  // import { useRouter } from 'next/router';
  import React, { useContext, useState } from 'react';
  import { useStore } from '../utils/store';
  import styles from '../styles/main.module.scss';

  
  export default function Layout({ children, title, description } : { children: React.ReactNode, title?: string, description?: string }) {
    // const router = useRouter();
    const { cart } = useStore();
    const theme = createTheme({
      typography: {
        h1: {
          fontSize: '1.6rem',
          fontWeight: 400,
          margin: '1rem 0',
        },
        h2: {
          fontSize: '1.4rem',
          fontWeight: 400,
          margin: '1rem 0',
        },
      },
      palette: {
        primary: {
          main: '#ff9159',
        },
        secondary: {
          main: '#208080',
        },
      },
    });
    return (
      <div>
        <Head>
          <title>{title ? `${title} | Gebhaly` : 'Gebhaly'}</title>
          {description && <meta name="description" content={description}></meta>}
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static" className={styles.navbar}>
            <Toolbar>
              <NextLink href="/" passHref>
                <Link>
                  <Typography className={styles.brand}>Gebhaly</Typography>
                </Link>
              </NextLink>
              <div className={styles.grow}></div>
              <div>
                <NextLink href="/cart" passHref>
                  <Link>
                    {cart.length > 0 ? (
                      <Badge
                        badgeContent={cart.length}
                        color="secondary"
                      >
                        Cart
                      </Badge>
                    ) : (
                      'Cart'
                    )}
                  </Link>
                </NextLink>
              </div>
            </Toolbar>
          </AppBar>
          <Container className={styles.main}>{children}</Container>
          <footer className={styles.footer}>
            <Typography>All Rights Reserved.</Typography>
          </footer>
        </ThemeProvider>
      </div>
    );
  }
  