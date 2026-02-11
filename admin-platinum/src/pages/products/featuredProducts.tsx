import { useEffect, useState } from 'react';
import Layout from '@/components/Layouts/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { productService, FeaturedProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, X, Plus, Search } from 'lucide-react';
import FeatureProductModal from '@/components/products/FeatureProductModal';
import { Product } from '@/models/product';
import { Application } from '@/models/application';
import axiosClient from '@/services/axiosInstance';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const FeaturedProducts = () => {
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductApplications, setSelectedProductApplications] = useState<Application[]>([]);
  const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getFeaturedProducts();
      setFeaturedProducts(response.products);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Error al cargar productos destacados.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchAvailableProducts = async (searchQuery: string = '') => {
    try {
      setProductsLoading(true);
      const client = axiosClient();
      const response = await client.get(`/products?type=all&page=1&pageSize=100${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      const { products } = response.data;
      
      // Filter out already featured products
      const featuredProductIds = new Set(featuredProducts.map(p => p.id));
      const filteredProducts = products.filter((p: Product) => !featuredProductIds.has(p.id));
      
      setAvailableProducts(filteredProducts);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Error al cargar productos disponibles.',
        variant: 'destructive',
      });
    } finally {
      setProductsLoading(false);
    }
  };

  const handleOpenProductSelect = () => {
    setProductSelectModalOpen(true);
    setProductSearchQuery('');
    fetchAvailableProducts();
  };

  const handleProductSelect = async (product: Product) => {
    try {
      const client = axiosClient();
      const response = await client.get(`/products/${product.id}`);
      const productData = response.data;
      setSelectedProduct(productData);
      setSelectedProductApplications(productData.applications || []);
      setProductSelectModalOpen(false);
      setFeatureModalOpen(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Error al cargar el producto.',
        variant: 'destructive',
      });
    }
  };

  const handleProductSearch = (query: string) => {
    setProductSearchQuery(query);
    fetchAvailableProducts(query);
  };

  const handleEditProduct = async (product: FeaturedProduct) => {
    try {
      const client = axiosClient();
      const response = await client.get(`/products/${product.id}`);
      const productData = response.data;
      setSelectedProduct(productData);
      setSelectedProductApplications(productData.applications || []);
      setFeatureModalOpen(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Error al cargar el producto.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveFeatured = async (productId: string) => {
    try {
      await productService.setFeaturedProduct(productId, null);
      toast({
        title: 'Éxito',
        description: 'Producto desmarcado como destacado.',
      });
      fetchFeaturedProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al desmarcar el producto.',
        variant: 'destructive',
      });
    }
  };

  const formatApplicationDisplay = (app: any): string => {
    if (app.displayText) {
      return app.displayText;
    }

    const parts: string[] = [];
    const attributeValues = app.attributeValues || [];

    const getAttributeValue = (attrName: string) => {
      const attr = attributeValues.find((av: any) =>
        av.attribute?.name === attrName ||
        av.attribute?.name?.toLowerCase() === attrName.toLowerCase()
      );
      if (!attr) return null;
      return attr.valueString || attr.valueNumber || attr.valueBoolean || attr.valueDate;
    };

    const modelo = getAttributeValue('Modelo');
    const submodelo = getAttributeValue('Submodelo');
    const año = getAttributeValue('Año');
    const litrosMotor = getAttributeValue('Litros_Motor');

    if (modelo) parts.push(String(modelo));
    if (submodelo) parts.push(String(submodelo));
    if (año) parts.push(String(año));
    if (litrosMotor) parts.push(`${litrosMotor} LTS`);

    const shortId = app.id.substring(app.id.length - 8).toUpperCase();
    if (parts.length > 0) {
      return `${parts.join(' - ')} (${shortId})`;
    }
    return `Aplicación (${shortId})`;
  };

  return (
    <Layout>
      <div className="w-full max-w-full">
        <Card className="border-0 shadow-none w-full">
          <CardHeader className="flex flex-row items-center justify-between p-0 m-0 pb-6 w-full">
            <div className="flex flex-col gap-3">
              <CardTitle>Productos Destacados</CardTitle>
              <CardDescription>
                Gestiona los productos destacados que se muestran en la página principal (máximo 10)
              </CardDescription>
            </div>
            <Button
              onClick={handleOpenProductSelect}
              disabled={featuredProducts.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay productos destacados.</p>
                <p className="text-sm mt-2">Haz clic en "Agregar Producto" para comenzar a destacar productos.</p>
              </div>
            ) : (
              <>
                {featuredProducts.length >= 10 && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Límite alcanzado:</strong> Ya tienes 10 productos destacados. Desmarca uno para agregar otro.
                    </p>
                  </div>
                )}
                <div className="grid gap-4">
                  {featuredProducts.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              <h3 className="font-semibold">{product.sku}</h3>
                              <span className="text-sm text-muted-foreground">-</span>
                              <span className="text-sm">{product.name}</span>
                            </div>
                            {product.featuredApplication && (
                              <div className="ml-7 text-sm text-muted-foreground">
                                <strong>Aplicación destacada:</strong>{' '}
                                {formatApplicationDisplay(product.featuredApplication)}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveFeatured(product.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Quitar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Total: {featuredProducts.length} / 10 productos destacados
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <FeatureProductModal
        open={featureModalOpen}
        onOpenChange={setFeatureModalOpen}
        product={selectedProduct}
        applications={selectedProductApplications}
        isCurrentlyFeatured={selectedProduct ? featuredProducts.some(p => p.id === selectedProduct.id) : false}
        currentFeaturedApplicationId={selectedProduct?.featuredApplicationId || null}
        onSuccess={() => {
          fetchFeaturedProducts();
          setSelectedProduct(null);
          setSelectedProductApplications([]);
        }}
      />

      <Dialog open={productSelectModalOpen} onOpenChange={setProductSelectModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Seleccionar Producto</DialogTitle>
            <DialogDescription>
              Busca y selecciona un producto para destacar. Solo se muestran productos que aún no están destacados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por SKU o nombre..."
                value={productSearchQuery}
                onChange={(e) => handleProductSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  {productSearchQuery
                    ? 'No se encontraron productos con ese criterio de búsqueda.'
                    : 'No hay productos disponibles para destacar.'}
                </p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {availableProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleProductSelect(product)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{product.sku}</p>
                          <p className="text-sm text-muted-foreground">{product.name}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Seleccionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProductSelectModalOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default FeaturedProducts;
