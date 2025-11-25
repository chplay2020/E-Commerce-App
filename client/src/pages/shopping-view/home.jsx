import { ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, BabyIcon, UmbrellaIcon, WatchIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import bannerOne from '../../assets/banner-1.webp';
import bannerTwo from '../../assets/banner-2.webp';
import bannerThree from '../../assets/banner-3.webp';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTitle from '@/components/shopping-view/product-title';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { Skeleton } from '@/components/ui/skeleton';


const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footware", label: "Footware", icon: UmbrellaIcon }
]

function ShoppingHome() {

    const [currentSlide, setCurrentSlide] = useState(0);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productList, productDetails, isLoading } = useSelector((state) => state.shoppingProducts);
    const { user } = useSelector((state) => state.auth);

    const slides = [bannerOne, bannerTwo, bannerThree];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [])

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
    }, [dispatch]);

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    function handleAddtoCart(getCurrentProductId, quantity = 1) {
        dispatch(addToCart({
            userId: user?.id,
            productId: getCurrentProductId,
            quantity: quantity
        })).then(data => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast.success("Item added to cart");
            }
        });
    }

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section]: [getCurrentItem.id]
        };
        sessionStorage.setItem('filters', JSON.stringify(currentFilter));
        navigate('/shopping/listing');
    }

    console.log("Product List on Home Page:", productList);

    return (
        <div className="flex flex-col min-h-screen w-full">
            <div className="relative w-full max-w-full h-[calc(100vh-64px)] overflow-hidden">
                {
                    slides.map((slide, index) => (
                        <img
                            key={index}
                            src={slide}
                            alt={`Banner ${index + 1}`}
                            className={`absolute top-0 left-0 w-full h-full object-contain bg-gray-100 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))
                }
                <Button
                    variant="outline" size="icon"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length)}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 rounded-full border-input text-sm bg-white/80 hover:bg-white shadow-sm"
                >
                    <ChevronLeftIcon className='w-4 h-4' />
                </Button>
                <Button
                    variant="outline" size="icon"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)}
                    className="absolute top-1/2 right-8 transform -translate-y-1/2 rounded-full border-input text-sm bg-white/80 hover:bg-white shadow-sm"
                >
                    <ChevronRightIcon className='w-4 h-4' />
                </Button>
            </div>
            <section className='py-12 bg-gray-50'>
                <div className='container mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-8 text-gray-900'>
                        Shop by Category
                    </h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {
                            categoriesWithIcon.map((categoryItem) => (
                                <Card
                                    key={categoryItem.id}
                                    onClick={() => handleNavigateToListingPage(categoryItem, 'category')}
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                                        <span className='font-bold'>
                                            {categoryItem.label}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </section>

            <section className='py-12'>
                <div className='container mx-auto px-4'>
                    <div className='flex items-center justify-between mb-8'>
                        <h2 className='text-3xl font-bold text-gray-900'>
                            Featured Products
                        </h2>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/shopping/listing')}
                            className="group"
                        >
                            View All
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                            {[...Array(10)].map((_, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <Skeleton className="h-64 w-full" />
                                    <CardContent className="p-4 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-8 w-full mt-2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                            {
                                productList && productList.length > 0 ?
                                    productList.slice(0, 10).map((productItem) => (
                                        <div key={productItem._id} className="animate-in fade-in duration-500">
                                            <ShoppingProductTitle
                                                product={productItem}
                                                handleGetProductDetails={handleGetProductDetails}
                                                handleAddtoCart={handleAddtoCart}
                                            />
                                        </div>
                                    )) : (
                                        <div className='col-span-full text-center py-12'>
                                            <p className='text-gray-500 text-lg'>No products available.</p>
                                        </div>
                                    )
                            }
                        </div>
                    )}
                </div>
            </section>

            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
                handleAddtoCart={handleAddtoCart}
            />
        </div>
    )
}

export default ShoppingHome;