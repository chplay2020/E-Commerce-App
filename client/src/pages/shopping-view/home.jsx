import { ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, BabyIcon, UmbrellaIcon, WatchIcon, ArrowRight, Truck, ShieldCheck, Headphones, CreditCard, Star, Quote, TrendingUp, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import bannerOne from '../../assets/banner-1.jpg';
import bannerTwo from '../../assets/banner-2.jpg';
import bannerThree from '../../assets/banner-3.jpg';
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
import { Input } from '@/components/ui/input';


const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footware", label: "Footware", icon: UmbrellaIcon }
]

const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: ShirtIcon },
    { id: "adidas", label: "Adidas", icon: ShirtIcon },
    { id: "puma", label: "Puma", icon: ShirtIcon },
    { id: "levi", label: "Levi's", icon: ShirtIcon },
    { id: "zara", label: "Zara", icon: ShirtIcon },
    { id: "h&m", label: "H&M", icon: ShirtIcon }
]

const features = [
    {
        icon: Truck,
        title: "Free Shipping",
        description: "Free shipping on orders over $50"
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        description: "100% secure payment processing"
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Dedicated customer support"
    },
    {
        icon: CreditCard,
        title: "Easy Returns",
        description: "30-day return policy"
    }
]

const testimonials = [
    {
        name: "Sarah Johnson",
        rating: 5,
        comment: "Amazing quality and fast delivery! The products exceeded my expectations. Highly recommended!",
        avatar: "SJ"
    },
    {
        name: "Michael Chen",
        rating: 5,
        comment: "Great shopping experience. The customer service team was very helpful and responsive.",
        avatar: "MC"
    },
    {
        name: "Emma Williams",
        rating: 4,
        comment: "Love the variety of products available. The prices are competitive and the quality is excellent!",
        avatar: "EW"
    }
]

function ShoppingHome() {

    const [currentSlide, setCurrentSlide] = useState(0);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [email, setEmail] = useState('');
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

    function handleNewsletterSubscribe(e) {
        e.preventDefault();
        if (email) {
            toast.success("Thank you for subscribing to our newsletter!");
            setEmail('');
        }
    }

    // Get best sellers (products with highest rating or most reviews)
    const bestSellers = productList
        ? [...productList]
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            .slice(0, 5)
        : [];

    // Get new arrivals (latest products)
    const newArrivals = productList
        ? [...productList]
            .reverse()
            .slice(0, 5)
        : [];

    console.log("Product List on Home Page:", productList);

    return (
        <div className="flex flex-col w-full bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Carousel Section */}
            <div className="relative w-full max-w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
                {
                    slides.map((slide, index) => (
                        <div key={index} className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                            <img
                                src={slide}
                                alt={`Banner ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {/* Hero Overlay Text */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                                <div className="container mx-auto px-6 md:px-12">
                                    <div className="max-w-2xl space-y-6 text-white animate-in fade-in slide-in-from-left duration-1000">
                                        <div className="inline-block">
                                            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                                                ✨ New Collection 2025
                                            </span>
                                        </div>
                                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl text-gray-300">
                                            Discover Your Perfect Style
                                        </h1>

                                        <p className="text-lg md:text-xl lg:text-2xl text-gray-100 max-w-xl drop-shadow-lg">
                                            Explore the latest fashion trends with exclusive deals and premium quality
                                        </p>
                                        <div className="flex flex-wrap gap-4 pt-4">
                                            <Button
                                                size="lg"
                                                onClick={() => navigate('/shopping/listing')}
                                                className="bg-white text-black hover:bg-gray-100 font-bold text-base md:text-lg px-6 md:px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                                            >
                                                Shop Now
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                onClick={() => {
                                                    const featuredSection = document.getElementById('featured-products');
                                                    featuredSection?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-base md:text-lg px-6 md:px-8 py-6 rounded-xl backdrop-blur-sm bg-white/10 transition-all hover:scale-105"
                                            >
                                                Explore More
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }

                {/* Navigation Buttons */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length)}
                    className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl z-20 w-12 h-12 transition-all hover:scale-110"
                >
                    <ChevronLeftIcon className='w-5 h-5' />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)}
                    className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl z-20 w-12 h-12 transition-all hover:scale-110"
                >
                    <ChevronRightIcon className='w-5 h-5' />
                </Button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'w-10 bg-white shadow-lg'
                                : 'w-2.5 bg-white/60 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <section className='py-12 md:py-16 bg-white'>
                <div className='container mx-auto px-4 md:px-6'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
                        {
                            features.map((feature, index) => (
                                <div
                                    key={index}
                                    className='flex flex-col items-center text-center space-y-3 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group'
                                >
                                    <div className='w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm'>
                                        <feature.icon className='w-7 h-7 md:w-8 md:h-8 text-primary' />
                                    </div>
                                    <h3 className='font-bold text-base md:text-lg text-gray-900'>{feature.title}</h3>
                                    <p className='text-gray-600 text-xs md:text-sm leading-relaxed'>{feature.description}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            {/* Shop by Category */}
            <section className='py-12 md:py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
                <div className='container mx-auto px-4 md:px-6'>
                    <div className='text-center mb-10 md:mb-12'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
                            Shop by Category
                        </h2>
                        <p className='text-gray-600 text-base md:text-lg max-w-2xl mx-auto'>
                            Explore our diverse collection across different categories
                        </p>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4'>
                        {
                            categoriesWithIcon.map((categoryItem) => (
                                <Card
                                    key={categoryItem.id}
                                    onClick={() => handleNavigateToListingPage(categoryItem, 'category')}
                                    className="cursor-pointer bg-white border-2 border-transparent hover:border-primary/40 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group overflow-hidden"
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-5 md:p-6 relative">
                                        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        <categoryItem.icon className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 text-primary group-hover:scale-110 transition-transform duration-300 relative z-10" />
                                        <span className='font-bold text-sm md:text-base text-gray-900 relative z-10'>
                                            {categoryItem.label}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Shop by Brand */}
            <section className='py-12 md:py-16 bg-white'>
                <div className='container mx-auto px-4 md:px-6'>
                    <div className='text-center mb-10 md:mb-12'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
                            Shop by Brand
                        </h2>
                        <p className='text-gray-600 text-base md:text-lg max-w-2xl mx-auto'>
                            Discover your favorite brands in one place
                        </p>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
                        {
                            brandsWithIcon.map((brandItem) => (
                                <Card
                                    key={brandItem.id}
                                    onClick={() => handleNavigateToListingPage(brandItem, 'brand')}
                                    className="cursor-pointer bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group"
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                                        <brandItem.icon className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        <span className='font-bold text-sm md:text-base text-gray-900'>
                                            {brandItem.label}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Best Sellers Section */}
            {!isLoading && bestSellers.length > 0 && (
                <section className='py-12 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f97316" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40' />
                    <div className='container mx-auto px-4 md:px-6 relative z-10'>
                        <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4'>
                            <div className='flex items-center gap-4'>
                                <div className='w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg'>
                                    <TrendingUp className='w-7 h-7 md:w-8 md:h-8 text-white' />
                                </div>
                                <div>
                                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-1'>
                                        Best Sellers
                                    </h2>
                                    <p className='text-gray-600 text-sm md:text-base'>Most loved by our customers</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/shopping/listing')}
                                className="group border-2 hover:bg-white hover:shadow-lg font-semibold"
                            >
                                View All Products
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4'>
                            {
                                bestSellers.map((productItem) => (
                                    <div key={productItem._id} className="animate-in fade-in duration-500">
                                        <ShoppingProductTitle
                                            product={productItem}
                                            handleGetProductDetails={handleGetProductDetails}
                                            handleAddtoCart={handleAddtoCart}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
            )}

            {/* New Arrivals Section */}
            {!isLoading && newArrivals.length > 0 && (
                <section className='py-12 md:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23a855f7" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40' />
                    <div className='container mx-auto px-4 md:px-6 relative z-10'>
                        <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4'>
                            <div className='flex items-center gap-4'>
                                <div className='w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg'>
                                    <Sparkles className='w-7 h-7 md:w-8 md:h-8 text-white' />
                                </div>
                                <div>
                                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-1'>
                                        New Arrivals
                                    </h2>
                                    <p className='text-gray-600 text-sm md:text-base'>Fresh styles just for you</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/shopping/listing')}
                                className="group border-2 hover:bg-white hover:shadow-lg font-semibold"
                            >
                                View All Products
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4'>
                            {
                                newArrivals.map((productItem) => (
                                    <div key={productItem._id} className="animate-in fade-in duration-500">
                                        <ShoppingProductTitle
                                            product={productItem}
                                            handleGetProductDetails={handleGetProductDetails}
                                            handleAddtoCart={handleAddtoCart}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className='py-12 md:py-16 bg-white' id="featured-products">
                <div className='container mx-auto px-4 md:px-6'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4'>
                        <div>
                            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                                Featured Products
                            </h2>
                            <p className='text-gray-600 text-base md:text-lg'>Handpicked items just for you</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/shopping/listing')}
                            className="group border-2 hover:bg-gray-50 hover:shadow-lg font-semibold"
                        >
                            View All Products
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4'>
                            {[...Array(10)].map((_, index) => (
                                <Card key={index} className="overflow-hidden rounded-xl">
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
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4'>
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

            {/* Promotional Banner */}
            <section className='py-16 md:py-20 bg-gradient-to-r from-primary via-primary/90 to-primary text-white relative overflow-hidden'>
                <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")] opacity-30' />
                <div className='container mx-auto px-4 md:px-6 relative z-10'>
                    <div className='max-w-4xl mx-auto text-center space-y-6 md:space-y-8'>
                        <div className='inline-block'>
                            <span className='bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30 shadow-lg'>
                                🎉 Limited Time Offer
                            </span>
                        </div>
                        <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
                            Special Offer This Week
                        </h2>
                        <p className='text-xl md:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed'>
                            Get up to <span className='font-bold text-yellow-300'>50% OFF</span> on selected items! Don't miss out on these amazing deals.
                        </p>
                        <div className='flex flex-wrap justify-center gap-4 pt-4'>
                            <Button
                                size="lg"
                                onClick={() => navigate('/shopping/listing')}
                                className="bg-white text-primary hover:bg-gray-100 font-bold text-base md:text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Shop Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className='py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30'>
                <div className='container mx-auto px-4 md:px-6'>
                    <div className='text-center mb-12 md:mb-14'>
                        <div className='inline-block mb-4'>
                            <span className='bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold'>
                                ⭐ Customer Reviews
                            </span>
                        </div>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                            What Our Customers Say
                        </h2>
                        <p className='text-gray-600 text-base md:text-lg max-w-2xl mx-auto'>
                            Real reviews from real customers who love our products
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto'>
                        {
                            testimonials.map((testimonial, index) => (
                                <Card key={index} className='bg-white border border-gray-200 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group'>
                                    <CardContent className='p-6 md:p-8 space-y-5 relative'>
                                        <div className='absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity'>
                                            <Quote className='w-16 h-16 text-primary' />
                                        </div>
                                        <div className='flex items-center gap-1 relative z-10'>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < testimonial.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'fill-gray-200 text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className='text-gray-700 leading-relaxed relative z-10 text-sm md:text-base'>
                                            "{testimonial.comment}"
                                        </p>
                                        <div className='flex items-center gap-4 pt-4 border-t border-gray-100 relative z-10'>
                                            <div className='w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary text-base md:text-lg shadow-sm'>
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <p className='font-bold text-gray-900 text-base'>{testimonial.name}</p>
                                                <p className='text-sm text-gray-500 flex items-center gap-1'>
                                                    <ShieldCheck className='w-3.5 h-3.5 text-green-500' />
                                                    Verified Customer
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className='py-16 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden'>
                <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-50' />
                <div className='container mx-auto px-4 md:px-6 relative z-10'>
                    <div className='max-w-3xl mx-auto text-center space-y-8'>
                        <div className='w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 shadow-2xl'>
                            <Mail className='w-8 h-8 md:w-10 md:h-10' />
                        </div>
                        <div className='space-y-4'>
                            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
                                Stay In The Loop
                            </h2>
                            <p className='text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed'>
                                Subscribe to get special offers, free giveaways, and exclusive deals delivered to your inbox.
                            </p>
                        </div>
                        <form onSubmit={handleNewsletterSubscribe} className='flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto'>
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className='bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1 h-12 md:h-14 rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-white/40 transition-all text-base'
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="bg-white text-gray-900 hover:bg-gray-100 font-bold h-12 md:h-14 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                Subscribe
                            </Button>
                        </form>
                        <div className='flex items-center justify-center gap-2 text-xs md:text-sm text-gray-400'>
                            <ShieldCheck className='w-4 h-4 text-green-400' />
                            <p>
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
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