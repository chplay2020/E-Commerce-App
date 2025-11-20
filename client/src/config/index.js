import { LayoutDashboard, ShoppingBasket, BadgeCheck } from "lucide-react";

export const registerFormControls = [
    {
        name: 'userName',
        label: 'User Name',
        placeholder: 'Enter your user name',
        componentType: 'input',
        type: 'text',
        required: true
    },
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        componentType: 'input',
        type: 'email',
        required: true
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        componentType: 'input',
        type: 'password',
        required: true
    }
]


export const loginFormControls = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        componentType: 'input',
        type: 'email',
        required: true
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        componentType: 'input',
        type: 'password',
        required: true
    }
]


export const addProductFormElements = [
    {
        label: "Title",
        name: "title",
        componentType: "input",
        type: "text",
        placeholder: "Enter product title",
    },
    {
        label: "Description",
        name: "description",
        componentType: "textarea",
        placeholder: "Enter product description",
    },
    {
        label: "Category",
        name: "category",
        componentType: "select",
        options: [
            { id: "men", label: "Men" },
            { id: "women", label: "Women" },
            { id: "kids", label: "Kids" },
            { id: "accessories", label: "Accessories" },
            { id: "footware", label: "Footware" }
        ]
    },
    {
        label: "Brand",
        name: "brand",
        componentType: "select",
        options: [
            { id: "nike", label: "Nike" },
            { id: "adidas", label: "Adidas" },
            { id: "puma", label: "Puma" },
            { id: "levi", label: "Levi's" },
            { id: "zara", label: "Zara" },
            { id: "h&m", label: "H&M" }
        ]
    },
    {
        label: "Price",
        name: "price",
        componentType: "input",
        type: "number",
        placeholder: "Enter product price",
    },
    {
        label: "Sale Price",
        name: "salePrice",
        componentType: "input",
        type: "number",
        placeholder: "Enter sale price (optional)",
    },
    {
        label: "Total Stock",
        name: "totalStock",
        componentType: "input",
        type: "number",
        placeholder: "Enter total stock",
    }
]


export const shoppingViewHeaderMenuItems = [
    {
        id: 'home',
        label: 'Home',
        path: '/shopping/home'
    },
    {
        id: 'men',
        label: 'Men',
        path: '/shopping/listing'
    },
    {
        id: 'women',
        label: 'Women',
        path: '/shopping/listing'
    },
    {
        id: 'kids',
        label: 'Kids',
        path: '/shopping/listing'
    },
    {
        id: 'accessories',
        label: 'Accessories',
        path: '/shopping/listing'
    },
    {
        id: 'footware',
        label: 'Footware',
        path: '/shopping/listing'
    }
]

export const categoryOptionMap = {
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    accessories: 'Accessories',
    footware: 'Footware'
}


export const brandOptionMap = {
    nike: 'Nike',
    adidas: 'Adidas',
    puma: 'Puma',
    levi: "Levi's",
    zara: 'Zara',
    "h&m": 'H&M'
}

export const filterOptions = {
    category: [
        { id: 'men', label: 'Men' },
        { id: 'women', label: 'Women' },
        { id: 'kids', label: 'Kids' },
        { id: 'accessories', label: 'Accessories' },
        { id: 'footware', label: 'Footware' }
    ],
    brand: [
        { id: 'nike', label: 'Nike' },
        { id: 'adidas', label: 'Adidas' },
        { id: 'puma', label: 'Puma' },
        { id: 'levi', label: "Levi's" },
        { id: 'zara', label: 'Zara' },
        { id: 'h&m', label: 'H&M' }
    ]
}

export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" }
]