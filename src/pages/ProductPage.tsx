import PageShell from "@/components/PageShell";
import { useCart } from "@/contexts/CartContext";
import { bikes } from "@/data/bikes";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

const ProductPage = () => {
    const { id } = useParams();
    const { addItem } = useCart();
    const bike = bikes.find(b => b.id === parseInt(id || "0"));
    const images = bike?.images || [bike?.image];
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!bike) {
        return <Navigate to="/products" />;
    }

    const handleAdd = () => {
        console.log("Adding bike to cart", bike);
        addItem({
            id: bike.id,
            name: bike.name,
            brand: bike.brand,
            image: bike.image,
            color: bike.color,
            size: bike.size,
        });
    };

    const selectImage = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        // <div className="min-h-screen bg-background">
        //     <Header />
        //     <div className="container mx-auto px-4 py-8">
        //         <h1 className="text-3xl font-bold mb-4">Product Page</h1>
        //         <p className="text-muted-foreground">This is the product page content.</p>
        //     </div>
        // </div>
        <PageShell>
            <div className="grid md:grid-cols-2 gap-20 pb-20 pt-20 px-10">
                <div className="bg-[#F7F7F7] px-4">
                    <img 
                    src={images[currentIndex]} 
                    alt={bike.name} 
                    className="w-full h-auto rounded-lg"
                    />
                    {images.length > 1 && (
                        <div className="flex gap-2 mt-4 justify-center">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`${bike.name} view ${idx + 1}`}
                                    className={`w-16 h-16 object-contain rounded cursor-pointer border-2 transition-all duration-200 ${
                                        idx === currentIndex 
                                            ? 'border-primary outline outline-2 outline-primary/30 shadow-lg' 
                                            : 'border-gray-300 hover:border-primary/50 outline outline-1 outline-gray-200'
                                    }`}
                                    onClick={() => selectImage(idx)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-4">{bike.name}</h1>
                    <p className="text-muted-foreground mb-4">{bike.brand}</p>
                    <p className="text-lg mb-6">Size: {bike.size}</p>
                    <p className="text-lg mb-6">Color: {bike.color}</p>
                    <p className="text-lg mb-6">₹{bike.price.toLocaleString()}</p>
                    <div className="mt-6">
                    <button
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                        onClick={handleAdd}
                    >
                        Add to Cart
                    </button>
                    </div>
                </div>
            </div>

                
        </PageShell>
    );
};

export default ProductPage;