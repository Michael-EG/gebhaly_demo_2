import Layout from '../../components/layout'
import { GetServerSideProps } from 'next';
import { Product, useStore } from '../../utils/store';
import {Grid,Link,List,ListItem, Typography, Button, Card, Dialog, DialogTitle, ListItemText} from '@mui/material';
import NextLink from 'next/link';
import styles from '../../styles/main.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';

function Product({productData, connection_error}: {productData: Product, connection_error: boolean}) {
    const router = useRouter();
    const {cart, products, addToCart} = useStore();
    
    function addCartItem(cartItem: Product) {
      let redirectFlag: boolean = addToCart(cartItem, 1);
      if(redirectFlag) {
          router.push('/cart');
      }
    }

    function handleReload() {
      router.reload();
    }

  return (
      <Layout title={productData.title} description={productData.description}>
      <div className={styles.section}>
        <Dialog onClose={handleReload} open={connection_error}>
          <DialogTitle>Error</DialogTitle>
          <List sx={{ pt: 0 }}>
            <ListItem>
                <ListItemText primary={`Conection error or API not responding`} />
            </ListItem>
            <ListItem button autoFocus onClick={handleReload}><ListItemText primary="Reload" /></ListItem>
          </List>
        </Dialog>
        <NextLink href="/" passHref>
          <Link>
            <Typography>back to results</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={productData.image}
            alt={productData.title}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {productData.title}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {productData.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {productData.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>$ {productData.price.toString()}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {productData.available > 0 ? 'In-Stock' : 'Un-available'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {addCartItem(productData)}}
                >
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
      
  )
}

export default Product

export const getServerSideProps: GetServerSideProps = async(context) => {
    const {params} = context;
    let connection_error = false;
    let newProduct: Product = {id: -1, image: '', title: '', description: '', price: 0, category: '', available: 0};
    try {
      const product_initial = await fetch(`https://fakestoreapi.com/products/${params !== undefined ? params.id : 'None'}`);
      const data = await product_initial.json();
      newProduct = {id:data.id, image: data.image, title: data.title, description: data.description, price: data.price, category: data.category, available: 10}
      
    } catch(e) {
      console.log('Error connecting to fake store API');
      connection_error = true;
    }
    return {
      props: {
        productData: newProduct,
        connection_error: connection_error,
      },
    };
}