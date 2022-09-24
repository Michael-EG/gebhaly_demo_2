import Layout from '../components/layout'
import { GetServerSideProps } from 'next';
import { Product, useStore } from '../utils/store';
import {Grid, Link, CardMedia, CardContent, Typography, CardActions, Button, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, List, ListItem} from '@mui/material';
import {SelectChangeEvent} from '@mui/material';
import NextLink from 'next/link';
import styles from '../styles/main.module.scss';
import React, { useEffect } from 'react';
// import Product from './product/[id]';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';
// import NextLink from 'next/link';

function CartPage({productsData}: {productsData: Product[]}) {
    
    const { cart, products, removeFromCart, updateCartItem } = useStore();
    const router = useRouter();

    // function addCartItem(cartItem: Product) {
    //     let redirectFlag: boolean = addToCart(cartItem, 1);
    //     if(redirectFlag) {
    //         router.push('/cart');
    //     }
    // }

    return (
        <Layout title="Shopping Cart">
            <Typography component="h1" variant="h1">
                Shopping Cart
            </Typography>
            {cart.length === 0 ? (
                <div>
                Cart is Empty.{' '}
                    <NextLink href="/" passHref>
                        <Link>Go Shopping</Link>
                    </NextLink>
                </div>
            ) : (
                <Grid container spacing={1}>
                    <Grid item md={9} xs={12}>
                        <TableContainer>
                        <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Add</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {cart.map((item) => {
                                let currentProduct = products.filter((x) => x.id === item.id) || [];
                                return (
                                    <TableRow key={`${item.title} ${item.id}`}>
                                        <TableCell>
                                            <NextLink href={`/product/${item.id}`} passHref>
                                            <Link>
                                                <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={50}
                                                height={52}
                                                />
                                            </Link>
                                            </NextLink>
                                        </TableCell>
                                        <TableCell>
                                            <NextLink href={`/product/${item.id}`} passHref>
                                            <Link className={styles.link}>
                                                <Typography>{item.title}</Typography>
                                            </Link>
                                            </NextLink>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Select
                                            value={item.quantity}
                                              onChange={(e: SelectChangeEvent<unknown>) => updateCartItem(item, e.target.value as string)}
                                            >
                                            {[...Array.from(Array(currentProduct.length > 0 ? currentProduct[0].available : 1).keys())].map((x) => (
                                                <MenuItem key={x + 1} value={x + 1}>
                                                {x + 1}
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell align="right">{`$ ${item.price}`}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                            variant="contained"
                                            color="secondary"
                                              onClick={() => removeFromCart(item)}
                                            >
                                            X
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Card>
                        <List>
                            <ListItem>
                            <Typography variant="h2">
                                Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)}{' '}
                                items) : ${' '}
                                {cart.reduce((a, c) => a + c.price * c.quantity, 0)}
                            </Typography>
                            </ListItem>
                            <ListItem>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                // onClick={checkoutHandler}
                            >
                                Check Out
                            </Button>
                            </ListItem>
                        </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
    </Layout>
        
    )
}

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
