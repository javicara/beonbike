import Typography from '@/components/ui/Typography';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Typography variant="h1" weight="bold">
        Welcome to Beonbike.pro
      </Typography>
      
      <Typography variant="h2" weight="semibold">
        Your Electric Mobility Partner
      </Typography>
      
      <Typography variant="h3" weight="medium">
        Sales • Conversions • Rentals • Tours
      </Typography>
      
      <Typography variant="body">
        Experience the future of mobility with our premium electric bikes and expert services.
        Located in the beautiful Sunshine Coast, we're here to help you discover the joy of
        electric cycling.
      </Typography>
      
      <Typography variant="small" className="text-neutral-600">
        Visit our showroom today to explore our range of electric bikes and accessories.
      </Typography>
    </div>
  );
}
