import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/products-service';
import ProductDetails from '@/components/website/products/ProductDetails';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProductBySlug(params.slug);
    
    if (!product) {
      return {
        title: 'Product Not Found | Rippa Tackle',
        description: 'The requested product could not be found.'
      };
    }
    
    return {
      title: `${product.name} | Rippa Tackle`,
      description: product.shortDescription || product.description?.substring(0, 160) || product.name
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Rippa Tackle',
      description: 'View our fishing tackle products'
    };
  }
}

export default function ProductPage({ params }: Props) {
  return <ProductDetails slug={params.slug} />;
} 