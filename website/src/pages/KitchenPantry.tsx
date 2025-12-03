import CustomSpaceTemplate from '../components/CustomSpaceTemplate';

export default function KitchenPantry() {
  return (
    <CustomSpaceTemplate
      title="Kitchen Pantry"
      heroImage="https://images.pexels.com/photos/6489119/pexels-photo-6489119.jpeg?auto=compress&cs=tinysrgb&w=1600"
      description="Adjustable shelves, pull-out racks, and lighting optimization. Create an organized pantry that makes meal preparation efficient and enjoyable."
      features={[
        'Adjustable shelving systems',
        'Pull-out drawers and baskets',
        'Spice rack and can organizers',
        'Deep storage for bulk items',
        'LED lighting for visibility',
        'Door-mounted storage solutions',
      ]}
      galleryImages={[
        'https://images.pexels.com/photos/6489119/pexels-photo-6489119.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4099141/pexels-photo-4099141.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6580220/pexels-photo-6580220.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4099093/pexels-photo-4099093.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800',
      ]}
    />
  );
}
