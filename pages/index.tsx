import Layout from '../components/layout'
import { GetServerSideProps } from 'next';
import { Product, useStore } from '../utils/store';
import {Grid, CardMedia, CardContent, Typography, CardActions, Button, Card, Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemText, CardHeader, IconButton} from '@mui/material';
import NextLink from 'next/link';
import styles from '../styles/main.module.scss';
import React, { useEffect } from 'react';
// import Product from './product/[id]';
import { useRouter } from 'next/router';

function Home({productsData, connection_error}: {productsData: Product[], connection_error: boolean}) {
    
    const { cart, setProducts, addToCart } = useStore();
    const router = useRouter();

    function addCartItem(cartItem: Product) {
        let redirectFlag: boolean = addToCart(cartItem, 1);
        if(redirectFlag) {
            router.push('/cart');
        }
    }

    function handleReload() {
        router.reload();
    }

    // useEffect(() => {console.log(cart)}, [cart]);
    useEffect(() => {setProducts(productsData);}, [productsData, setProducts]);

    // if(connection_error) {
    //     return (
            
    //     );
    // }

    return (
        <Layout>
            
            <div>
            <Dialog onClose={handleReload} open={connection_error}>
            <DialogTitle>Error</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem>
                    <ListItemText primary={`Conection error or API not responding`} />
                </ListItem>
                <ListItem button autoFocus onClick={handleReload}><ListItemText primary="Reload" /></ListItem>
                
            </List>
            </Dialog>
                <h1>Products</h1>
                <Grid container spacing={3}>
                {productsData.map((product) => (
                    <Grid flex={1} item md={4} key={product.title}>
                        <Card className={styles.product_card}>
                            <CardHeader
                                subheader={
                                <Grid container direction='row' flex={1} justifyContent='space-between'>
                                    <Grid item>{product.category}</Grid>
                                    <Grid item>Stock: {product.available}</Grid>
                                </Grid>}
                            />
                            <NextLink href={`/product/${product.id}`} passHref>
                            <CardMedia
                                component="img"
                                image={product.image}
                                title={product.title}
                                height={'70%'}
                                width={'100%'}
                                className={styles.product_card_image}
                            ></CardMedia>
                            </NextLink>
                            <NextLink href={`/product/${product.id}`} passHref>
                            <CardContent className={styles.product_card_title}>
                                <Typography>{product.title}</Typography>
                            </CardContent>
                            </NextLink>
                            <CardActions>
                            <Typography>$ {product.price.toString()}</Typography>
                            <Button
                                size="small"
                                color="primary"
                                onClick={(event: React.MouseEvent<HTMLElement>) => {addCartItem(product);}}
                            >
                                Add to Cart
                            </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                </Grid>
            </div>
        </Layout>
        
    )
}

export default Home

export const getServerSideProps: GetServerSideProps = async(context) => {
    const {params} = context;
    let products_formatted: Product[] = [];
    let connection_error = false;
    try {
        const product_initial = await fetch(`https://fakestoreapi.com/products`);
        const data = await product_initial.json();
        for(let i=0;i<data.length;i++) {
            var newProduct: Product = {id:data[i].id, image: data[i].image, title: data[i].title, description: data[i].description, price: data[i].price, category: data[i].category, available: 10}
            products_formatted.push(newProduct);
        }
    } catch(e) {
        console.log('Error connecting to fake store API');
        connection_error = true;
    }
    return {
      props: {
        productsData: products_formatted,
        connection_error: connection_error,
      },
    };
  }