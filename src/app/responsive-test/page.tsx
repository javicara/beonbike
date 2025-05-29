import { ResponsiveIndicator } from '@/components/ui/ResponsiveIndicator';
import Typography from '@/components/ui/Typography';

export default function ResponsiveTest() {
  return (
    <div className="min-h-screen">
      <ResponsiveIndicator />
      
      {/* Container with responsive padding */}
      <div className="container">
        <Typography variant="h1" weight="bold" className="mb-8">
          Responsive Layout Test
        </Typography>

        {/* Grid that changes columns based on breakpoint */}
        <div className="grid grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-primary text-white p-4 rounded-lg flex items-center justify-center"
            >
              Grid Item {item}
            </div>
          ))}
        </div>

        {/* Responsive text sizes (already handled by Typography component) */}
        <div className="space-y-4 mb-8">
          <Typography variant="h2">Responsive Typography</Typography>
          <Typography variant="body">
            This text automatically adjusts its size based on the viewport width.
            The Typography component handles responsive text sizes using the
            tailwind breakpoints we defined.
          </Typography>
        </div>

        {/* Responsive spacing */}
        <div className="space-y-4 mobile:space-y-6 tablet:space-y-8 desktop:space-y-12 mb-8">
          <div className="bg-secondary text-white p-4 rounded-lg">
            Spacing Test 1
          </div>
          <div className="bg-secondary text-white p-4 rounded-lg">
            Spacing Test 2
          </div>
          <div className="bg-secondary text-white p-4 rounded-lg">
            Spacing Test 3
          </div>
        </div>

        {/* Responsive padding and margin */}
        <div className="p-4 mobile:p-6 tablet:p-8 desktop:p-12 bg-accent text-white rounded-lg mb-8">
          This box has responsive padding
        </div>

        {/* Responsive flexbox layout */}
        <div className="flex flex-col tablet:flex-row gap-4 mb-8">
          <div className="flex-1 bg-neutral p-4 rounded-lg text-white">
            Flex Item 1
          </div>
          <div className="flex-1 bg-neutral p-4 rounded-lg text-white">
            Flex Item 2
          </div>
        </div>

        {/* Hide/Show elements based on breakpoint */}
        <div className="mb-8">
          <div className="mobile:hidden">
            <Typography variant="h3">Only visible below mobile breakpoint</Typography>
          </div>
          <div className="hidden mobile:block tablet:hidden">
            <Typography variant="h3">Only visible on mobile</Typography>
          </div>
          <div className="hidden tablet:block desktop:hidden">
            <Typography variant="h3">Only visible on tablet</Typography>
          </div>
          <div className="hidden desktop:block">
            <Typography variant="h3">Only visible on desktop</Typography>
          </div>
        </div>
      </div>
    </div>
  );
} 