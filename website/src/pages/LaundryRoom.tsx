import CustomSpaceTemplate from '../components/CustomSpaceTemplate';

export default function LaundryRoom() {
  return (
    <CustomSpaceTemplate
      title="Laundry Room"
      heroImage="https://images.pexels.com/photos/5824508/pexels-photo-5824508.jpeg?auto=compress&cs=tinysrgb&w=1600"
      description="Clean, bright layouts with folding counters and hidden storage. Transform your laundry room into an efficient and stylish workspace."
      features={[
        'Custom folding counter surfaces',
        'Upper and lower cabinet systems',
        'Hidden hamper and basket storage',
        'Hanging rod for air-drying',
        'Utility sink integration options',
        'Cleaning supply organization',
      ]}
      galleryImages={[
        'https://images.pexels.com/photos/5824508/pexels-photo-5824508.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/5824444/pexels-photo-5824444.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4099471/pexels-photo-4099471.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6197116/pexels-photo-6197116.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/5824478/pexels-photo-5824478.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=800',
      ]}
    />
  );
}
