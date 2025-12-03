import CustomSpaceTemplate from '../components/CustomSpaceTemplate';

export default function ReachInClosets() {
  return (
    <CustomSpaceTemplate
      title="Reach-in Closets"
      heroImage="https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1600"
      description="Smartly organized closets for small spaces with maximum functionality and style. Perfect for bedrooms, hallways, and guest rooms."
      features={[
        'Custom shelving configurations for optimal space usage',
        'Adjustable shelving and hanging rods',
        'Built-in drawer systems and organizers',
        'LED lighting integration',
        'Soft-close doors and hardware',
        'Space-efficient design for compact areas',
      ]}
      galleryImages={[
        'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1125130/pexels-photo-1125130.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
      ]}
    />
  );
}
