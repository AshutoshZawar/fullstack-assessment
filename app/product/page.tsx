'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  stacklineSku: string;
  title: string;
  categoryName: string;
  subCategoryName: string;
  imageUrls: string[];
  featureBullets: string[];
  retailerSku: string;
}

function ProductContent() {
  const searchParams = useSearchParams();
  const sku = searchParams.get('sku');
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("cartCount") || "0");
    setCartCount(count);
  }, []);

  useEffect(() => {
    if (sku) {
      setLoading(true);
      // Fetch all products and find the one with the matching SKU
      // This is a workaround since the specific SKU API was removed
      fetch(`/api/products?limit=1000`)
        .then((res) => res.json())
        .then((data) => {
          const found = data.products.find((p: Product) => p.stacklineSku === sku);
          setProduct(found || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [sku]);

  const addToCart = () => {
    setAdding(true);
    setTimeout(() => {
      const currentCount = parseInt(localStorage.getItem("cartCount") || "0");
      const newCount = currentCount + 1;
      localStorage.setItem("cartCount", newCount.toString());
      setCartCount(newCount);

      window.dispatchEvent(new Event("cartUpdated"));

      setAdding(false);
      toast.success(`${product?.title} added to cart!`);
    }, 500);
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Product not found. SKU: {sku}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">StackShop</Link>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full font-bold">
                {cartCount}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <div className="space-y-4">
            <Card className="overflow-hidden border-2">
              <CardContent className="p-0">
                <div className="relative h-96 w-full bg-white">
                  <Image
                    src={product.imageUrls[selectedImage]}
                    alt={product.title}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            {product.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-20 border-2 rounded-md shrink-0 bg-white ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}
                  >
                    <Image src={url} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Badge variant="secondary">{product.categoryName}</Badge>
                <Badge variant="outline">{product.subCategoryName}</Badge>
              </div>
              <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>
              <p className="text-sm text-muted-foreground font-mono">SKU: {product.retailerSku}</p>
            </div>

            <Button
              className="w-full h-14 text-xl font-semibold shadow-lg transition-transform active:scale-[0.98]"
              onClick={addToCart}
              disabled={adding}
            >
              <ShoppingCart className="mr-2 h-6 w-6" />
              {adding ? "Adding to Cart..." : "Add to Cart"}
            </Button>

            {product.featureBullets.length > 0 && (
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-bold mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {product.featureBullets.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm leading-relaxed">
                        <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center mt-20">Loading...</div>}>
      <ProductContent />
    </Suspense>
  );
}
