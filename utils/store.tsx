import { createContext, ReactNode, SetStateAction, useContext, useState } from "react";

export type Product = {
    id: number,
    category: string,
    image: string,
    title: string,
    description: string,
    price: number,
    available: number
}

export type CartEntry = {
    id: number,
    category: string,
    image: string,
    title: string,
    description: string,
    price: number,
    quantity: number
}

type StoreType = {
    cart: CartEntry[];
    products: Product[];
    setProducts: (productsData: SetStateAction<Product[]>) => void;
    addToCart: (cartItem: Product, quantity: number) => boolean;
    removeFromCart: (cartItem: CartEntry) => void;
    updateCartItem: (cartItem: CartEntry, quantity: string) => void;

};

type Props = {
    children: ReactNode;
};

// initial store values
const storeContextDefaultValues: StoreType = {
    cart: [],
    products: [],
    setProducts: (productsData: SetStateAction<Product[]>) => {},
    addToCart: (cartItem: Product, quantity: number) => {return false;},
    removeFromCart: (cartItem: CartEntry) => {},
    updateCartItem: (cartItem: CartEntry, quantity: string) => {},
};

const StoreContext = createContext<StoreType>(storeContextDefaultValues);

export function useStore() {
    return useContext(StoreContext);
}

export function StoreProvider({ children }: Props) {
    const [cart, setCart] = useState<CartEntry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const setProductsData = (productsData: SetStateAction<Product[]>) => {
        setProducts(productsData);
    }

    const addToCart = (cartItem: Product, quantity: number) => {
        let item_found = false;
        let tempIndex = -1;
        for(let i=0;i<cart.length;i++) {
            if(cartItem.id === cart[i].id) {
                item_found = true;
                tempIndex = i;
                break;
            }
        }
        if(!item_found) {
            let tempCart = [...cart];
            let tempCartItem: CartEntry = {id: cartItem.id, title: cartItem.title, category: cartItem.category, description: cartItem.description, price: cartItem.price, image: cartItem.image, quantity: 1};
            tempCart.push(tempCartItem);
            setCart([...tempCart]);
        }
        return item_found;
    }

    const updateCartItemQuantity = (cartItem: CartEntry, quantity: string) => {
        let parseQuantity: number = Number(quantity);
        if(parseQuantity) {
            for(let i=0;i<cart.length;i++) {
                if(cartItem.id === cart[i].id) {
                    let productSelected = products.filter((x) => x.id === cartItem.id);
                    if(productSelected.length > 0) {
                        if(parseQuantity <= productSelected[0].available) {
                            let tempCart = [...cart];
                            cart[i].quantity = parseQuantity;
                            setCart([...tempCart]);
                            break;
                        }
                    }
                }
            }
        }
        
    }

    const removeFromCart = (cartItem: CartEntry) => {
        const tempCart = cart.filter((x) => x.id !== cartItem.id);
        setCart([...tempCart]);
    }

    const value = {
        cart: cart,
        products: products,
        setProducts: setProductsData,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateCartItem: updateCartItemQuantity,
    }

    return (
        <>
            <StoreContext.Provider value={value}>
                {children}
            </StoreContext.Provider>
        </>
    );
}